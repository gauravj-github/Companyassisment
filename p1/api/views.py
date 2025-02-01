from django.shortcuts import render
from rest_framework.decorators import api_view
from .serializers import *
from rest_framework.response import Response
import pandas as pd
import io
from django.http import FileResponse
from .models import *
from django.core.files.base import ContentFile


# Create your views here.
SALES_INCREASE = {
    "A": 0.10,
    "B": 0.075,
    "C": 0.08,
    "D": 0.12
}



@api_view(["POST"])
def fileUploader(request):
   

    file1 = request.FILES['file1']
    file2 = request.FILES['file2']

    try:
        fl1 = pd.read_excel(io.BytesIO(file1.read()))
        fl2 = pd.read_excel(io.BytesIO(file2.read()))
    except Exception as e:
        return Response({"error": f"Error reading files: {str(e)}"}, status=400)

    allfile = pd.merge(fl1, fl2, on='SKUs')
    if "Current stocks" in allfile.columns:
        allfile.drop(columns=["Current stocks"], inplace=True)
    allfile["Sales Forecast"] = allfile["Last month sales"] * allfile["SKUs"].map(SALES_INCREASE)
    allfile["Purchase Order (PO)"] = allfile["Sales Forecast"] * allfile["Price"]
  
    output_file = io.BytesIO()
    allfile.to_excel(output_file, index=False)
    output_file.seek(0)

    processed_file = Uploadfile()
    processed_file.file.save("processed_sales.xlsx", ContentFile(output_file.read()))
    processed_file.save()
    file_url = processed_file.file.url


    return Response({"file": file_url}, status=201)


