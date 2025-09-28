import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app, 
     origins=["http://127.0.0.1:5500", "http://localhost:5500", "http://127.0.0.1:5000", "http://localhost:5000"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"],
     supports_credentials=True)  # allow frontend requests

# Database connection function
def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )

# ------------------- HEALTH CHECK -------------------
@app.route('/test_user_1_queue', methods=['GET'])
def test_user_1_queue():
    """Specific test for user ID 1 queue status"""
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Direct query to check user 1's queue
        cursor.execute("SELECT * FROM queue WHERE user_id=1 AND status='waiting'", ())
        result = cursor.fetchone()
        
        return jsonify({
            "user_id": 1,
            "raw_query_result": result,
            "found_waiting_entry": result is not None
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.route('/debug_user_queue/<int:user_id>', methods=['GET'])
def debug_user_queue_status(user_id):
    """Debug endpoint to check user's queue status directly"""
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get all queue entries for this user
        cursor.execute("SELECT * FROM queue WHERE user_id=%s ORDER BY join_time DESC", (user_id,))
        all_entries = cursor.fetchall()
        
        # Get waiting entries
        cursor.execute("SELECT * FROM queue WHERE user_id=%s AND status='waiting'", (user_id,))
        waiting_entries = cursor.fetchall()
        
        return jsonify({
            "user_id": user_id,
            "all_queue_entries": all_entries,
            "waiting_entries": waiting_entries,
            "has_waiting_entry": len(waiting_entries) > 0
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint to test CORS"""
    return jsonify({"status": "ok", "message": "API is running"}), 200

@app.route('/test_time_format', methods=['POST'])
def test_time_format():
    """Test time format conversion for debugging"""
    try:
        data = request.json
        time_string = data.get('time_string')
        
        if not time_string:
            return jsonify({"message": "time_string is required"}), 400
        
        from datetime import datetime, date
        
        # Clean up the time string
        time_string = time_string.strip().upper()
        
        # Try different formats
        time_formats = [
            '%I:%M %p',  # 09:00 AM, 1:00 PM
            '%H:%M',     # 14:30, 09:00
            '%I:%M%p',   # 9:00AM (no space)
        ]
        
        results = {
            "input": time_string,
            "formats_tried": [],
            "success": False,
            "converted_time": None,
            "full_datetime": None
        }
        
        for fmt in time_formats:
            try:
                parsed_time = datetime.strptime(time_string, fmt).time()
                today = date.today()
                full_datetime = datetime.combine(today, parsed_time)
                
                results["formats_tried"].append({"format": fmt, "success": True})
                results["success"] = True
                results["converted_time"] = parsed_time.strftime("%H:%M:%S")
                results["full_datetime"] = full_datetime.strftime("%Y-%m-%d %H:%M:%S")
                break
                
            except ValueError as e:
                results["formats_tried"].append({"format": fmt, "success": False, "error": str(e)})
        
        return jsonify(results), 200
        
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

@app.route('/debug_tables', methods=['GET'])
def debug_tables():
    """Debug all table structures"""
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        tables_info = {}
        
        # Check each table
        table_names = ['users', 'queue', 'counters']
        
        for table in table_names:
            try:
                # Get table structure
                cursor.execute(f"DESCRIBE {table}")
                columns = cursor.fetchall()
                
                # Get sample data
                cursor.execute(f"SELECT * FROM {table} LIMIT 3")
                sample_data = cursor.fetchall()
                
                tables_info[table] = {
                    "columns": columns,
                    "sample_data": sample_data,
                    "exists": True
                }
                
            except Exception as table_error:
                tables_info[table] = {
                    "exists": False,
                    "error": str(table_error)
                }
        
        return jsonify({
            "status": "ok",
            "tables": tables_info
        }), 200
        
    except Exception as e:
        return jsonify({"status": "error", "message": f"Database error: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.route('/debug_db', methods=['GET'])
def debug_database():
    """Debug database structure"""
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Check users table structure
        cursor.execute("DESCRIBE users")
        users_columns = cursor.fetchall()
        
        # Get sample user data
        cursor.execute("SELECT * FROM users LIMIT 3")
        sample_users = cursor.fetchall()
        
        # Check if queue table exists
        queue_info = None
        try:
            cursor.execute("DESCRIBE queue")
            queue_columns = cursor.fetchall()
            cursor.execute("SELECT * FROM queue LIMIT 3")
            sample_queue = cursor.fetchall()
            queue_info = {
                "columns": queue_columns,
                "sample_data": sample_queue
            }
        except Exception as queue_error:
            queue_info = {"error": str(queue_error)}
        
        return jsonify({
            "status": "ok",
            "users_table": {
                "columns": users_columns,
                "sample_data": sample_users
            },
            "queue_table": queue_info
        }), 200
        
    except Exception as e:
        return jsonify({"status": "error", "message": f"Database error: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.route('/test_db', methods=['GET'])
def test_database():
    """Test database connection"""
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        return jsonify({"status": "ok", "message": "Database connected successfully", "test_result": result}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": f"Database connection failed: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# ------------------- REGISTER -------------------
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('fullname')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'user')  # default role is 'user'

    if not username or not email or not password:
        return jsonify({"message": "All fields are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Check if user already exists
    cursor.execute("SELECT * FROM users WHERE email=%s OR username=%s", (email, username))
    existing_user = cursor.fetchone()
    if existing_user:
        cursor.close()
        conn.close()
        return jsonify({"message": "Already registered. Please login."}), 400

    # Hash the password before storing
    password_hash = generate_password_hash(password)

    # Insert new user
    cursor.execute(
        "INSERT INTO users (username, email, password_hash, role) VALUES (%s, %s, %s, %s)",
        (username, email, password_hash, role)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Registered successfully!"}), 201

# ------------------- LOGIN -------------------
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({"message": "Invalid email or password"}), 401

    # DEBUG: Check what role the database returns
    print("DB returned role:", user['role'])

    # Return user info for frontend
    return jsonify({
        "message": "Login successful",
        "user_id": user["id"],
        "username": user["username"],
        "role": user["role"]  # Make sure this is exactly 'admin' for admin users
    })

# ------------------- GET USER DATA -------------------
@app.route('/get_user/<int:user_id>', methods=['GET'])
def get_user_data(user_id):
    """Get current user's data including profile and queue status"""
    conn = None
    cursor = None
    try:
        print(f"DEBUG: Getting user data for user_id: {user_id}")
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get user details
        cursor.execute("SELECT * FROM users WHERE id=%s", (user_id,))
        user = cursor.fetchone()
        cursor.fetchall()  # Consume any remaining results
        
        print(f"DEBUG: User query result: {user}")
        
        if not user:
            return jsonify({"message": "User not found"}), 404
        
        # Build user_data based on available fields
        user_data = {
            "user_id": user.get("id", user_id),
            "username": user.get("username", "Unknown"),
            "email": user.get("email", "N/A"),
            "role": user.get("role", "user"),
            "queue_status": None
        }
        
        # Try to get queue status if queue table exists
        try:
            print(f"DEBUG: Checking queue status for user_id: {user_id}")
            
            # First, check if there are ANY queue entries for this user
            cursor.execute("SELECT COUNT(*) as total_count FROM queue WHERE user_id=%s", (user_id,))
            total_result = cursor.fetchone()
            total_count = total_result["total_count"] if total_result else 0
            print(f"DEBUG: Total queue entries for user: {total_count}")
            
            # Check waiting entries specifically
            cursor.execute("SELECT COUNT(*) as waiting_count FROM queue WHERE user_id=%s AND status='waiting'", (user_id,))
            waiting_result = cursor.fetchone()
            waiting_count = waiting_result["waiting_count"] if waiting_result else 0
            print(f"DEBUG: Waiting queue entries for user: {waiting_count}")
            
            # Get all queue entries for debugging
            cursor.execute("SELECT queue_id, status, join_time, category, counter_id FROM queue WHERE user_id=%s ORDER BY join_time DESC", (user_id,))
            all_queues = cursor.fetchall()
            print(f"DEBUG: All queue entries: {all_queues}")
            
            # Now get the specific waiting entry
            cursor.execute(
                "SELECT queue_id, status, join_time, category, counter_id, slot_time FROM queue WHERE user_id=%s AND status='waiting' ORDER BY join_time DESC LIMIT 1",
                (user_id,)
            )
            queue_status = cursor.fetchone()
            print(f"DEBUG: Queue status query result: {queue_status}")
            
            if queue_status:
                print(f"DEBUG: Found queue status - processing position calculation")
                print(f"DEBUG: Raw queue_status data: {queue_status}")
                print(f"DEBUG: slot_time type: {type(queue_status.get('slot_time'))}")
                print(f"DEBUG: slot_time value: {queue_status.get('slot_time')}")
                
                # Get position in queue for the same category
                cursor.execute(
                    "SELECT COUNT(*) as position FROM queue WHERE join_time <= %s AND status='waiting' AND category=%s",
                    (queue_status['join_time'], queue_status['category'])
                )
                position_result = cursor.fetchone()
                position = position_result["position"] if position_result else 1
                print(f"DEBUG: Calculated position: {position}")
                
                # Handle slot_time formatting - it might be a time object or datetime
                slot_time_formatted = None
                if queue_status.get("slot_time"):
                    try:
                        slot_time_value = queue_status["slot_time"]
                        if hasattr(slot_time_value, 'strftime'):
                            # It's a time or datetime object
                            if hasattr(slot_time_value, 'date'):
                                # It's a datetime object
                                slot_time_formatted = slot_time_value.strftime("%Y-%m-%d %H:%M:%S")
                            else:
                                # It's a time object, combine with today's date for display
                                from datetime import date
                                today = date.today()
                                slot_time_formatted = f"{today} {slot_time_value}"
                        else:
                            # It's a string, use as is
                            slot_time_formatted = str(slot_time_value)
                        print(f"DEBUG: Formatted slot_time: {slot_time_formatted}")
                    except Exception as slot_error:
                        print(f"DEBUG: Error formatting slot_time: {slot_error}")
                        slot_time_formatted = str(queue_status.get("slot_time"))
                
                try:
                    user_data["queue_status"] = {
                        "queue_id": queue_status["queue_id"],
                        "status": queue_status["status"],
                        "position": position,
                        "category": queue_status["category"],
                        "counter_id": queue_status["counter_id"],
                        "joined_at": queue_status["join_time"].strftime("%Y-%m-%d %H:%M:%S") if queue_status["join_time"] else None,
                        "slot_time": slot_time_formatted
                    }
                    print(f"DEBUG: Successfully created queue_status object: {user_data['queue_status']}")
                except Exception as create_error:
                    print(f"ERROR: Failed to create queue_status object: {create_error}")
                    # Create a basic queue_status object with raw data
                    user_data["queue_status"] = {
                        "queue_id": queue_status.get("queue_id"),
                        "status": queue_status.get("status"),
                        "position": position,
                        "category": queue_status.get("category"),
                        "counter_id": queue_status.get("counter_id"),
                        "joined_at": str(queue_status.get("join_time")),
                        "slot_time": str(queue_status.get("slot_time"))
                    }
                    print(f"DEBUG: Created fallback queue_status object: {user_data['queue_status']}")
            else:
                print(f"DEBUG: No waiting queue entry found for user {user_id}")
        except Exception as queue_error:
            print(f"DEBUG: Queue table error: {queue_error}")
            # Queue table doesn't exist or has issues, continue without queue status
        
        print(f"DEBUG: Returning user data: {user_data}")
        return jsonify(user_data)
        
    except Exception as e:
        print(f"ERROR in get_user_data: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"message": f"Server error: {str(e)}"}), 500
    finally:
        # Always close cursor and connection
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# ------------------- QUEUE MANAGEMENT -------------------
@app.route('/join_queue', methods=['POST'])
def join_queue():
    conn = None
    cursor = None
    try:
        data = request.json
        user_id = data.get('user_id')
        username = data.get('username')
        category = data.get('category', 'general')  # default category
        counter_id = data.get('counter_id', 1)  # default counter
        slot_time = data.get('slot_time')  # optional slot time
        
        print(f"DEBUG: Join queue request: user_id={user_id}, category={category}, counter_id={counter_id}, slot_time={slot_time}")
        
        if not user_id or not username:
            return jsonify({"message": "User ID and username are required"}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if user is already in queue
        cursor.execute("SELECT queue_id, category, counter_id, join_time, status FROM queue WHERE user_id=%s AND status='waiting'", (user_id,))
        existing_queue = cursor.fetchone()
        
        print(f"DEBUG: Checking for existing queue - user_id: {user_id}")
        print(f"DEBUG: Existing queue result: {existing_queue}")
        
        if existing_queue:
            cursor.close()
            conn.close()
            return jsonify({
                "message": "You are already in the queue",
                "existing_queue_id": existing_queue[0],
                "category": existing_queue[1],
                "counter_id": existing_queue[2],
                "join_time": str(existing_queue[3]),
                "status": existing_queue[4]
            }), 400
        
        # Process slot_time if provided
        processed_slot_time = None
        if slot_time:
            try:
                from datetime import datetime, date
                
                # Handle different time formats
                if isinstance(slot_time, str):
                    # Remove extra spaces and convert to uppercase
                    slot_time = slot_time.strip().upper()
                    
                    # Try to parse time formats like "09:00 AM", "9:00 AM", "14:30", etc.
                    time_formats = [
                        '%I:%M %p',  # 09:00 AM, 1:00 PM
                        '%H:%M',     # 14:30, 09:00
                        '%I:%M%p',   # 9:00AM (no space)
                    ]
                    
                    parsed_time = None
                    for fmt in time_formats:
                        try:
                            parsed_time = datetime.strptime(slot_time, fmt).time()
                            break
                        except ValueError:
                            continue
                    
                    if parsed_time:
                        # Combine with today's date to create a full datetime
                        today = date.today()
                        processed_slot_time = datetime.combine(today, parsed_time)
                        print(f"DEBUG: Converted slot_time '{slot_time}' to '{processed_slot_time}'")
                    else:
                        print(f"WARNING: Could not parse slot_time '{slot_time}', proceeding without it")
                        processed_slot_time = None
                        
            except Exception as time_error:
                print(f"WARNING: Error processing slot_time '{slot_time}': {time_error}")
                processed_slot_time = None
        
        # Add user to queue - DON'T include queue_id as it's auto-increment
        if processed_slot_time:
            cursor.execute(
                "INSERT INTO queue (user_id, category, counter_id, status, join_time, slot_time) VALUES (%s, %s, %s, 'waiting', NOW(), %s)",
                (user_id, category, counter_id, processed_slot_time)
            )
        else:
            cursor.execute(
                "INSERT INTO queue (user_id, category, counter_id, status, join_time) VALUES (%s, %s, %s, 'waiting', NOW())",
                (user_id, category, counter_id)
            )
        
        conn.commit()
        queue_id = cursor.lastrowid  # Get the auto-generated queue_id
        
        print(f"DEBUG: Successfully joined queue with queue_id: {queue_id}")
        
        return jsonify({
            "message": "Successfully joined the queue", 
            "queue_id": queue_id,
            "category": category,
            "counter_id": counter_id,
            "slot_time": processed_slot_time.strftime("%Y-%m-%d %H:%M:%S") if processed_slot_time else None
        }), 201
        
    except mysql.connector.Error as db_error:
        print(f"DATABASE ERROR in join_queue: {str(db_error)}")
        return jsonify({"message": f"Database error: {str(db_error)}"}), 500
    except Exception as e:
        print(f"ERROR in join_queue: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"message": f"Server error: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@app.route('/get_queue', methods=['GET'])
def get_queue():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT queue_id, user_id, category, counter_id, status, join_time, slot_time FROM queue WHERE status='waiting' ORDER BY join_time ASC"
    )
    queue = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return jsonify(queue)


@app.route('/mark_done/<int:queue_id>', methods=['PUT'])
def mark_done(queue_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE queue SET status='completed' WHERE queue_id=%s", (queue_id,))
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({"message": "Queue item marked as completed"})


@app.route('/get_user_queue_status/<int:user_id>', methods=['GET'])
def get_user_queue_status(user_id):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT queue_id, status, join_time, category FROM queue WHERE user_id=%s AND status='waiting'",
            (user_id,)
        )
        status = cursor.fetchone()
        cursor.fetchall()  # Consume any remaining results
        
        if status:
            # Get position in queue for the same category
            cursor.execute(
                "SELECT COUNT(*) as position FROM queue WHERE join_time <= %s AND status='waiting' AND category=%s",
                (status['join_time'], status['category'])
            )
            position_result = cursor.fetchone()
            cursor.fetchall()  # Consume any remaining results
            position = position_result['position']
            
            return jsonify({
                "in_queue": True,
                "position": position,
                "queue_id": status['queue_id'],
                "category": status['category']
            })
        else:
            return jsonify({"in_queue": False})
            
    except Exception as e:
        print(f"ERROR in get_user_queue_status: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# ------------------- COUNTERS MANAGEMENT -------------------
@app.route('/get_counters', methods=['GET'])
def get_counters():
    """Get all counters information"""
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM counters ORDER BY counter_id")
        counters = cursor.fetchall()
        return jsonify(counters)
    except Exception as e:
        print(f"ERROR in get_counters: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.route('/get_counters_by_category/<category>', methods=['GET'])
def get_counters_by_category(category):
    """Get counters for a specific category"""
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM counters WHERE category=%s ORDER BY counter_id", (category,))
        counters = cursor.fetchall()
        return jsonify(counters)
    except Exception as e:
        print(f"ERROR in get_counters_by_category: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# ------------------- SAMPLE DATA CREATION -------------------
@app.route('/create_sample_counters', methods=['POST'])
def create_sample_counters():
    """Create sample counter data"""
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Sample counter data
        sample_counters = [
            ('general', 10, 0),
            ('general', 10, 0),
            ('general', 10, 0),
            ('old-age', 8, 0),
            ('old-age', 8, 0),
            ('emergency', 5, 0)
        ]
        
        # Clear existing counters first (optional)
        cursor.execute("DELETE FROM counters")
        
        # Insert sample counters (counter_id will be auto-increment)
        for category, max_capacity, current_queue in sample_counters:
            cursor.execute(
                "INSERT INTO counters (category, max_capacity, current_queue) VALUES (%s, %s, %s)",
                (category, max_capacity, current_queue)
            )
        
        conn.commit()
        
        # Get the created counters
        cursor.execute("SELECT * FROM counters ORDER BY counter_id")
        counters = cursor.fetchall()
        
        return jsonify({
            "message": f"Created {len(sample_counters)} sample counters",
            "counters": counters
        }), 201
        
    except Exception as e:
        print(f"ERROR creating sample counters: {str(e)}")
        return jsonify({"message": f"Error creating sample counters: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


# ------------------- RUN APP -------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
