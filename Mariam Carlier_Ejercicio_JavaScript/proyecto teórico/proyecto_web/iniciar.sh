#!/bin/bash
echo "=========================================="
echo " Sistema de Gestión de Proyectos - ADSO"
echo " GA6 AA2_R6 - SENA"
echo "=========================================="
cd backend
pip install -r requirements.txt
echo ""
echo "Iniciando servidor Flask en puerto 5000..."
echo "Luego abre: frontend/index.html"
echo ""
python app.py
