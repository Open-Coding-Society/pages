# ⚡ Quick CORS Fix (30 Seconds)

## The Problem
```
CORS policy: Response to preflight request doesn't pass access control check
```

## The Fix

### 1️⃣ Install Flask-CORS (5 seconds)
```bash
cd ~/flaskbackend
pip install flask-cors
```

### 2️⃣ Add to Your Backend (10 seconds)

Open your backend's `main.py` and add these 2 lines:

```python
from flask_cors import CORS  # Add at top with imports

app = Flask(__name__)
CORS(app, supports_credentials=True)  # Add right after app creation
```

That's it! Just these 2 lines.

### 3️⃣ Restart Backend (5 seconds)
```bash
# Press Ctrl+C to stop
python main.py  # Start again
```

---

## ✅ Test It Works

Refresh your frontend page. You should now see in console:
```
✅ User authenticated - enabling post button
```

Instead of:
```
❌ CORS policy blocked
```

---

## 🎯 Full Example

Your `main.py` should look like this:

```python
from flask import Flask
from flask_cors import CORS  # ← ADD THIS

app = Flask(__name__)
CORS(app, supports_credentials=True)  # ← ADD THIS

# ... rest of your code ...
# (database setup, blueprints, etc.)

if __name__ == '__main__':
    app.run(port=8587, debug=True)
```

---

## That's All!

Just 2 lines of code and your CORS error will be gone! 🎉

Need detailed explanation? See `CORS_FIX_GUIDE.md`

