from onvif import ONVIFCamera

HOST="192.168.1.106"
PORT=80
USER="admin"
PASS="admin"

cam = ONVIFCamera(HOST, PORT, USER, PASS)
media = cam.create_media_service()

profiles = media.GetProfiles()
print("Profiles:", len(profiles))

for i,p in enumerate(profiles):
    token = p.token
    req = media.create_type('GetStreamUri')
    req.ProfileToken = token
    req.StreamSetup = {'Stream': 'RTP-Unicast', 'Transport': {'Protocol': 'RTSP'}}
    uri = media.GetStreamUri(req).Uri
    print(f"\n[{i}] Name: {getattr(p,'Name', '')}")
    print("Token:", token)
    print("RTSP:", uri)
