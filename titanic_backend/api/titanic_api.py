from flask import Blueprint, request, jsonify
from flask_restful import Api, Resource
from model.titanic import TitanicModel

titanic_api = Blueprint('titanic_api', __name__, url_prefix='/api/titanic')
api = Api(titanic_api)


class TitanicAPI:
    class _Predict(Resource):
        def post(self):
            """Predict Titanic survival probability.

            Expects JSON body with passenger fields:
              pclass (int 1-3), sex (str), age (float), sibsp (int),
              parch (int), fare (float), embarked (C/Q/S),
              alone (bool), name (str, optional)

            Returns JSON: { die: float, survive: float }
            """
            passenger = request.get_json()
            if not passenger:
                return jsonify({'error': 'No passenger data provided'}), 400

            model = TitanicModel.get_instance()
            response = model.predict(passenger)
            return jsonify(response)

    class _FeatureWeights(Resource):
        def get(self):
            """Return feature importance weights from the decision tree."""
            model = TitanicModel.get_instance()
            return jsonify(model.feature_weights())

    api.add_resource(_Predict, '/predict')
    api.add_resource(_FeatureWeights, '/feature-weights')
