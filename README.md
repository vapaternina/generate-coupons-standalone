# generate-coupons-standalone
# Funcionalidad
- Basado en el contenido de `input.csv`, el programa generará 4 cupones por cada línea, diviviendo su valor en 4 partes para el mismo contrato.
- Se generará un PDF para cada cupón
- Cada PDF será cargado en el bucket de S3 en su respectiva ruta `/gestion-cartera/dividir-factura/${userPhoneNumber}/${id}.pdf`
- El programa generará un archivo `output.json` con el resumen de todos los cupones generados por telefono y contrato.

# Instalación
1. Clonar el repositorio remoto `git clone`
2. Instalar dependencias con `npm install`
3. Crear un archivo `.env` basado en los valores de `.env.example`

# Ejecución
5. Cargar en el archivo `input.csv` los valores con la forma `contractId`,`couponValue`,`userId` en cada línea
6. Una vez que se ejecute el siguiente comando empezará a ejecutarse el programa para cada línea del csv
8. Ejecutar el programa con `node index.js`

# Example
## Input (contenido de `input.csv` en la raíz del proyecto)
Cada línea tiene la forma `contractId`,`couponValue`,`userId`, donde `userId` es el id de conversacion de Sunshine / WhatsApp)
```
10,20000,5542c41e5adcc0d6376ab749
10,23550,5542c41e5adcc0d6376ab749
10,27300,5542c41e5adcc0d6376ab749
```
## Output (contenido de `output.json` en la raíz del proyecto)
```
[
	{
		"userPhoneNumber": "573003100702",
		"contractId": "10",
		"coupons": [
			{
				"couponValue": 5000,
				"couponId": 222139074,
				"pdfPath": "/gestion-cartera/dividir-factura/573003100702/743bc848-303f-4ef1-ab66-397466b88cf0.pdf"
			},
			{
				"couponValue": 5000,
				"couponId": 222139075,
				"pdfPath": "/gestion-cartera/dividir-factura/573003100702/671e98e3-4b06-4fcb-9b58-3e611de72c11.pdf"
			},
			{
				"couponValue": 5000,
				"couponId": 222139076,
				"pdfPath": "/gestion-cartera/dividir-factura/573003100702/af7604b0-96ed-4037-85ac-8bbf2f43c5ef.pdf"
			},
			{
				"couponValue": 5000,
				"couponId": 222139077,
				"pdfPath": "/gestion-cartera/dividir-factura/573003100702/945228b9-a926-43eb-863b-1fd0d7c292e4.pdf"
			}
		]
	},
	{
		"userPhoneNumber": "573003100702",
		"contractId": "10",
		"coupons": [
			{
				"couponValue": 5887,
				"couponId": 222139078,
				"pdfPath": "/gestion-cartera/dividir-factura/573003100702/f9a41b9c-b2b0-48b2-a9d6-8b917cc1492e.pdf"
			},
			{
				"couponValue": 5887,
				"couponId": 222139079,
				"pdfPath": "/gestion-cartera/dividir-factura/573003100702/b815123f-7866-44e2-bc38-af34473bd77a.pdf"
			},
			{
				"couponValue": 5887,
				"couponId": 222139080,
				"pdfPath": "/gestion-cartera/dividir-factura/573003100702/34313d2d-9820-4944-b19c-c071c25f17a3.pdf"
			},
			{
				"couponValue": 5889,
				"couponId": 222139081,
				"pdfPath": "/gestion-cartera/dividir-factura/573003100702/d80c896f-3954-494d-b3dc-92254b7167b7.pdf"
			}
		]
	},
	{
		"userPhoneNumber": "573003100702",
		"contractId": "10",
		"coupons": [
			{
				"couponValue": 6825,
				"couponId": 222139082,
				"pdfPath": "/gestion-cartera/dividir-factura/573003100702/dc7becf1-8d0b-48cc-a904-9535dbee0d17.pdf"
			},
			{
				"couponValue": 6825,
				"couponId": 222139083,
				"pdfPath": "/gestion-cartera/dividir-factura/573003100702/a85cacde-be5d-40fa-b1b9-5eaadc88ca90.pdf"
			},
			{
				"couponValue": 6825,
				"couponId": 222139084,
				"pdfPath": "/gestion-cartera/dividir-factura/573003100702/8792ec35-93d8-40ed-8f05-c13882d502b9.pdf"
			},
			{
				"couponValue": 6825,
				"couponId": 222139085,
				"pdfPath": "/gestion-cartera/dividir-factura/573003100702/4aed7565-8539-43fe-9890-d3b702a3f507.pdf"
			}
		]
	}
]
```
