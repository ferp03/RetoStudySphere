using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AsteroidSpawnerScript : MonoBehaviour
{
    public GameObject asteroid;
    public float topY = 4;
    public float bottomY = -4;
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        if (Random.Range(0f, 1f) < 0.08f) {
                Instantiate(asteroid, new Vector3(transform.position.x, Random.Range(bottomY, topY), 0), Quaternion.identity);
            }
    }
}
