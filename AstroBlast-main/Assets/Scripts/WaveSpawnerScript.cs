using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class WaveSpawnerScript : MonoBehaviour
{
    public GameObject asteroid;
    public GameObject wave1;
    public GameObject wave2;
    public GameObject wave3;
    void Start() {
    }

    // Update is called once per frame
    void Update()
    {

    }


    public void wave1Spawn()
    {
        Instantiate(wave1, new Vector3(transform.position.x, transform.position.y, 0), Quaternion.identity);
    }

    public void wave2Spawn()
    {
        Instantiate(wave2, new Vector3(transform.position.x, transform.position.y, 0), Quaternion.identity);
    }

    public void wave3Spawn()
    {
        Instantiate(wave3, new Vector3(transform.position.x, transform.position.y, 0), Quaternion.identity);
    }
}
