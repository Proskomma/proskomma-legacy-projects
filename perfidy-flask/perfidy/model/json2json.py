from marshmallow import post_load
from .transform import Transform, TransformSchema
from .transform_type import TransformType


class Json2Json(Transform):
    def __init__(self, name, title, description, inputs=None, outputs=None, base_url=""):
        super().__init__(name, title, description, inputs, outputs, TransformType.JSON2JSON.name, base_url)

    def __repr__(self):
        return f'<Json2Json(name={self.name!r})>'

    def transform(self):
        if len(self.inputs) > 0 and isinstance(self.inputs[0], dict) and "return" in self.inputs[0]:
            self.result = {"output": self.inputs[0]["return"]} # returs json
            self.status = "complete"
        else:
            self.result = {"error": "Input not valid. Must be a JSON object with a `return` property with a value of a string"}
            self.status = "error"


class Json2JsonSchema(TransformSchema):
    @post_load
    def make_json2json(self, data, **kwargs):
        return Json2Json(**data)
