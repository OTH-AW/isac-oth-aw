using UnityEngine;
using UnityStandardAssets.CrossPlatformInput;
using Cinemachine;

public class Move : MonoBehaviour
{
    public bool InvertMovement;
    public float moveSpeed = 0.002f;
    public float zoomSpeed = 1.0f;
    public float minimumFov = 20.0f;
    public float maximumFov = 100.0f;

    private CinemachineVirtualCamera currentCamera;
    private CinemachineTrackedDolly cinemachineTrackedDolly;
    private float moveTrack;

    // Start is called before the first frame update
    void Start()
    {
        currentCamera = gameObject.GetComponent(typeof(CinemachineVirtualCamera)) as CinemachineVirtualCamera;
        cinemachineTrackedDolly = currentCamera.GetCinemachineComponent<CinemachineTrackedDolly>();
    }

    // Update is called once per frame
    void Update()
    {
        handleCameraPathPosition();
        handleCameraFieldOfView();
    }

    private void handleCameraPathPosition() {
        int invertMovementFactor = InvertMovement ? -1 : 1;
        // CrossPlatformInputManager.GetAxis("Horizontal") scheint nicht zu funktionierten.
        // Lösung hier:
        // https://answers.unity.com/questions/1401087/crossplatforminputmanagergetaxis-always-returns-0.html
        moveTrack = CrossPlatformInputManager.VirtualAxisReference("Horizontal").GetValue * moveSpeed * invertMovementFactor;

        cinemachineTrackedDolly.m_PathPosition = (cinemachineTrackedDolly.m_PathPosition + moveTrack) % 1;
    }

    private void handleCameraFieldOfView() {
        // Zoom mit FOV - könnte man auch mit Path Offset lösen, dann müsste man aber 
        // aber beachten, ob sich die Kamera bereits hinter dem Drucker befindet.
        float changeFovBy = CrossPlatformInputManager.VirtualAxisReference("Zoom").GetValue * zoomSpeed * currentCamera.m_Lens.FieldOfView;

        if (currentCamera.m_Lens.FieldOfView + changeFovBy >= minimumFov
            && currentCamera.m_Lens.FieldOfView + changeFovBy <= maximumFov) {
            currentCamera.m_Lens.FieldOfView += changeFovBy;
        }
    }
}
