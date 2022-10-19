from abc import abstractclassmethod, abstractmethod
import datetime as dt
from uuid import uuid1
from marshmallow import Schema, fields


class Transform():
    def __init__(self, name, title, description, inputs=None, outputs=None, transform_type="", base_url=""):
        self.id = str(uuid1())
        self.name = name
        self.title = title
        self.description = description
        self.inputs = inputs
        self.outputs = outputs
        self.transform_type = transform_type
        self.status = "queued"
        self.result = None
        self.created_at = dt.datetime.now()
        self.status_url = f"{base_url}/{self.id}"

    def __repr__(self):
        return f'<Transform(name={self.description!r})>'

    @abstractmethod
    def transform(self):
        pass


class TransformSchema(Schema):
    id = fields.Str()
    name = fields.Str()
    title = fields.Str()
    description = fields.Str()
    inputs = fields.List(fields.Dict())
    outputs = fields.List(fields.Dict())
    transform_type = fields.Str()
    status = fields.Str()
    result = fields.Dict()
    created_at = fields.DateTime()
    status_url = fields.Str()
    base_url = fields.Str()
