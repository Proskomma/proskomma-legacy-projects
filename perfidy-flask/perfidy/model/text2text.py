from marshmallow import post_load

from .transform import Transform, TransformSchema
from .transform_type import TransformType


class Text2Text(Transform):
    def __init__(self, name, title, description, inputs=None, outputs=None, base_url=""):
        super().__init__(name, title, description, inputs, outputs, TransformType.TEXT2TEXT.name, base_url)

    def __repr__(self):
        return f'<Text2Text(name={self.name!r})>'

    def transform(self):
        if len(self.inputs) > 0 and isinstance(self.inputs[0], dict) and "return" in self.inputs[0]:
            self.result = self.inputs[0]["return"] # returns text
            self.status = "complete"
        else:
            self.result = {"error": "Input not valid. Must be a JSON object with a `return` property with a value of a string"}
            self.status = "error"

class Text2TextSchema(TransformSchema):
    @post_load
    def make_text2text(self, data, **kwargs):
        return Text2Text(**data)
