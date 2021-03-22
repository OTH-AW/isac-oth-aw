using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Cinemachine;

public class CameraChangeLookAtTarget : MonoBehaviour
{
    public Transform target1;
    public Transform target2;
    public float changeTargetPathPosition = 0.59f;

    private CinemachineVirtualCamera currentCamera;
    private CinemachineTrackedDolly cinemachineTrackedDolly;

    // Start is called before the first frame update
    void Start()
    {
        currentCamera = gameObject.GetComponent(typeof(CinemachineVirtualCamera)) as CinemachineVirtualCamera;
        cinemachineTrackedDolly = currentCamera.GetCinemachineComponent<CinemachineTrackedDolly>();
    }

    // Update is called once per frame
    void Update()
    {
        Transform target = null;
        if (cinemachineTrackedDolly.m_PathPosition >= changeTargetPathPosition) {
            target = target1;
        } else {
            target = target2;
        }

        currentCamera.LookAt = target;
        
        // float speed = 5;

        // Quaternion OriginalRot = transform.rotation;
        // currentCamera.LookAt.LookAt(target);
        
        // Quaternion NewRot = transform.rotation;
        // currentCamera.LookAt.rotation = OriginalRot;
        // currentCamera.LookAt.rotation = Quaternion.Lerp(
        //     currentCamera.LookAt.rotation,
        //     NewRot,
        //     speed * Time.deltaTime);
    }
}
