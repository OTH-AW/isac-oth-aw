using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Cinemachine;

public class CameraTrackMovement : MonoBehaviour
{
    public float speed = 1f;
    private CinemachineVirtualCamera currentCamera;
    private CinemachineTrackedDolly cinemachineTrackedDolly;
    private bool revertProgress;

    // Start is called before the first frame update
    void Start()
    {
        currentCamera = gameObject.GetComponent(typeof(CinemachineVirtualCamera)) as CinemachineVirtualCamera;
        cinemachineTrackedDolly = currentCamera.GetCinemachineComponent<CinemachineTrackedDolly>();
    }

    // Update is called once per frame
    void Update()
    {
        float speedProgress = speed / 1000;
        if (!cinemachineTrackedDolly.m_Path.Looped) {
            if (cinemachineTrackedDolly.m_PathPosition - speedProgress <= 0) {
                revertProgress = false;
            } else if (cinemachineTrackedDolly.m_PathPosition + speedProgress>= 1) {
                revertProgress = true;
            }

            if(revertProgress) {
                speedProgress *= -1;
            }
        }

        cinemachineTrackedDolly.m_PathPosition = (cinemachineTrackedDolly.m_PathPosition + speedProgress) % 1;        
    }
}
