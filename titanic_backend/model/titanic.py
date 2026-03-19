from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
import pandas as pd
import numpy as np
import seaborn as sns


class TitanicModel:
    """Singleton model for Titanic passenger survival prediction."""

    _instance = None

    def __init__(self):
        self.model = None
        self.dt = None
        self.features = ['pclass', 'sex', 'age', 'sibsp', 'parch', 'fare', 'alone']
        self.target = 'survived'
        self.titanic_data = sns.load_dataset('titanic')
        self.encoder = OneHotEncoder(handle_unknown='ignore')

    def _clean(self):
        self.titanic_data.drop(
            ['alive', 'who', 'adult_male', 'class', 'embark_town', 'deck'],
            axis=1, inplace=True
        )
        self.titanic_data['sex'] = self.titanic_data['sex'].apply(
            lambda x: 1 if x == 'male' else 0
        )
        self.titanic_data['alone'] = self.titanic_data['alone'].apply(
            lambda x: 1 if x is True else 0
        )
        self.titanic_data.dropna(subset=['embarked'], inplace=True)

        onehot = self.encoder.fit_transform(self.titanic_data[['embarked']]).toarray()
        cols = ['embarked_' + str(val) for val in self.encoder.categories_[0]]
        onehot_df = pd.DataFrame(onehot, columns=cols)
        self.titanic_data = pd.concat([self.titanic_data, onehot_df], axis=1)
        self.titanic_data.drop(['embarked'], axis=1, inplace=True)
        self.features.extend(cols)
        self.titanic_data.dropna(inplace=True)

    def _train(self):
        X = self.titanic_data[self.features]
        y = self.titanic_data[self.target]

        self.model = LogisticRegression(max_iter=1000)
        self.model.fit(X, y)

        self.dt = DecisionTreeClassifier()
        self.dt.fit(X, y)

    @classmethod
    def get_instance(cls):
        """Get or create the singleton TitanicModel instance."""
        if cls._instance is None:
            cls._instance = cls()
            cls._instance._clean()
            cls._instance._train()
        return cls._instance

    def predict(self, passenger):
        """Predict survival probability for a passenger dict.

        Args:
            passenger (dict): Keys: pclass, sex, age, sibsp, parch, fare, embarked, alone, name

        Returns:
            dict: {'die': float, 'survive': float}
        """
        df = pd.DataFrame(passenger, index=[0])
        df['sex'] = df['sex'].apply(lambda x: 1 if x == 'male' else 0)
        df['alone'] = df['alone'].apply(lambda x: 1 if x is True else 0)

        onehot = self.encoder.transform(df[['embarked']]).toarray()
        cols = ['embarked_' + str(val) for val in self.encoder.categories_[0]]
        onehot_df = pd.DataFrame(onehot, columns=cols)
        df = pd.concat([df, onehot_df], axis=1)

        df.drop(columns=['embarked'], inplace=True, errors='ignore')
        df.drop(columns=['name'], inplace=True, errors='ignore')

        die, survive = np.squeeze(self.model.predict_proba(df))
        return {'die': float(die), 'survive': float(survive)}

    def feature_weights(self):
        """Get feature importances from the decision tree.

        Returns:
            dict: {feature: importance_float}
        """
        importances = self.dt.feature_importances_
        return {feat: float(imp) for feat, imp in zip(self.features, importances)}


def initTitanic():
    """Pre-load the Titanic model into memory."""
    TitanicModel.get_instance()


if __name__ == '__main__':
    model = TitanicModel.get_instance()
    test_passenger = {
        'name': 'Test Passenger',
        'pclass': 2,
        'sex': 'female',
        'age': 30,
        'sibsp': 0,
        'parch': 0,
        'fare': 16.0,
        'embarked': 'S',
        'alone': True,
    }
    result = model.predict(test_passenger)
    print(f"Die: {result['die']:.2%}  Survive: {result['survive']:.2%}")
    print("Feature weights:")
    for feat, weight in model.feature_weights().items():
        print(f"  {feat}: {weight:.2%}")
