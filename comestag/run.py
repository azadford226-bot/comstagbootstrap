#!/usr/bin/env python3
"""
Simple script to load .env file and run the Comestag application
"""
import os
import sys
import subprocess
from pathlib import Path

def load_env_file(env_file_path):
    """Load environment variables from .env file"""
    env_vars = {}
    
    if not os.path.exists(env_file_path):
        print(f"Error: {env_file_path} not found")
        return env_vars
    
    with open(env_file_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            
            # Skip empty lines and comments
            if not line or line.startswith('#'):
                continue
            
            # Parse key=value pairs
            if '=' in line:
                key, value = line.split('=', 1)
                key = key.strip()
                value = value.strip()
                
                # Remove quotes if present
                if value.startswith('"') and value.endswith('"'):
                    value = value[1:-1]
                elif value.startswith("'") and value.endswith("'"):
                    value = value[1:-1]
                
                env_vars[key] = value
    
    return env_vars

def main():
    # Get the directory where this script is located
    script_dir = Path(__file__).parent
    env_file = script_dir / '.env'
    jar_file = script_dir / 'target' / 'comestag-0.0.1-SNAPSHOT.jar'
    
    # Check if JAR file exists
    if not jar_file.exists():
        print(f"Error: JAR file not found at {jar_file}")
        print("Please run build-all.ps1 first")
        sys.exit(1)
    
    # Load environment variables
    print("Loading environment variables from .env...")
    env_vars = load_env_file(env_file)
    
    # Override to use 'local' profile for development
    env_vars['SPRING_PROFILES_ACTIVE'] = 'local'
    
    print(f"Loaded {len(env_vars)} environment variables")
    print(f"Profile: {env_vars.get('SPRING_PROFILES_ACTIVE', 'not set')}")
    print(f"Database: {env_vars.get('SPRING_DATASOURCE_URL', 'not set')}")
    print()
    
    # Merge with current environment
    env = os.environ.copy()
    env.update(env_vars)
    
    # Run the application
    print(f"Starting application from {jar_file}...")
    print("=" * 60)
    
    try:
        subprocess.run(
            ['java', '-jar', str(jar_file)],
            env=env,
            cwd=script_dir
        )
    except KeyboardInterrupt:
        print("\n\nApplication stopped by user")
    except Exception as e:
        print(f"\nError running application: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
