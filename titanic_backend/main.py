from flask import Flask
from flask_cors import CORS
from api.titanic_api import titanic_api
from model.titanic import initTitanic

app = Flask(__name__)
CORS(app, supports_credentials=True, origins='*')

# Register blueprints
app.register_blueprint(titanic_api)

# Pre-load the model at startup
initTitanic()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8587)
