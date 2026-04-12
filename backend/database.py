import sqlite3
import os
from datetime import datetime, timedelta

from generators import get_solar_generation, get_base_demand, apply_stochastic_shock

def initialize_database(db_path: str = "history.db", days: int = 30):
    """
    Generate synthetic history for the environment and save it to an SQLite database.
    This allows nodes to pre-train their ML models on startup without having to wait
    days of simulation time to gather their own training data.
    """
    # If the DB already exists, we skip generation to save time.
    if os.path.exists(db_path):
        print(f"  [DB] Found existing history database at {db_path}.")
        return

    print(f"  [DB] Generating {days} days of synthetic history to {db_path}...")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS environment (
            tick INTEGER PRIMARY KEY,
            time TEXT,
            hour REAL,
            solar_norm REAL,
            demand_norm REAL
        )
    ''')
    conn.commit()
    
    # Generate data
    start_time = datetime(2026, 5, 1, 0, 0, 0)
    time_step = timedelta(hours=1.0)
    
    records = []
    current_time = start_time
    total_ticks = days * 24
    
    for tick in range(total_ticks):
        hour = current_time.hour + current_time.minute / 60.0
        
        base_solar = get_solar_generation(hour)
        base_demand = get_base_demand(hour)
        solar, demand = apply_stochastic_shock(base_solar, base_demand)
        
        records.append((
            tick,
            current_time.isoformat(),
            hour,
            solar,
            demand
        ))
        
        current_time += time_step
        
    cursor.executemany('''
        INSERT INTO environment (tick, time, hour, solar_norm, demand_norm)
        VALUES (?, ?, ?, ?, ?)
    ''', records)
    
    conn.commit()
    conn.close()
    
    print(f"  [DB] Successfully generated {total_ticks} synthetic records.")

def fetch_history(db_path: str = "history.db", limit: int = 168):
    """
    Fetch the most recent history records from the database.
    """
    if not os.path.exists(db_path):
        return []
        
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT time, hour, solar_norm, demand_norm 
        FROM environment 
        ORDER BY tick DESC 
        LIMIT ?
    ''', (limit,))
    
    rows = cursor.fetchall()
    conn.close()
    
    # Reverse to keep chronological order
    rows.reverse()
    
    return rows
