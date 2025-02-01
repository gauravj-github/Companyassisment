from .models import *
from rest_framework import serializers

class  UploadFileserializear(serializers.ModelSerializer):
    class Meta:
        model = Uploadfile
        fields = ["id","file"]