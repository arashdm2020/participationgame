from onvif import ONVIFCamera

HOST = "192.168.1.106"
# پورت‌های رایج ONVIF: 80, 8000, 8080, 8899
PORTS = [80, 8000, 8080, 8899]
USER = "admin"
PASS = "admin"

for port in PORTS:
    try:
        cam = ONVIFCamera(HOST, port, USER, PASS)
        devicemgmt = cam.create_devicemgmt_service()
        info = devicemgmt.GetDeviceInformation()
        print(f"\n[OK] ONVIF on {HOST}:{port}")
        print("Manufacturer:", info.Manufacturer)
        print("Model:", info.Model)
        print("FirmwareVersion:", info.FirmwareVersion)
        print("SerialNumber:", info.SerialNumber)
        break
    except Exception as e:
        print(f"[FAIL] {HOST}:{port} -> {e.__class__.__name__}: {e}")
