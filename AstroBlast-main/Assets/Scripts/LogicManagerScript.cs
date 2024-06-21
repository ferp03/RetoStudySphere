using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class LogicManagerScript : MonoBehaviour
{
    private WaveSpawnerScript waveSpawnerScript;
    public GameObject asteroidSpawner;
    public Text wave;
    private int kills = 0;
    void Start()
    {
        waveSpawnerScript = GameObject.FindGameObjectWithTag("WaveSpawner").GetComponent<WaveSpawnerScript>();
        StartCoroutine(SpawnAsteroidField());
        
    }

    // Update is called once per frame
    void Update()
    {
             
    }

    public void addKill() {
        kills++;
        if (kills == 3) {
            StartCoroutine(SpawnWave2());
        } 
        if (kills == 5) {
            StartCoroutine(SpawnWave3());
        }
        if (kills == 10) {
            SceneManager.LoadScene("Winner");
        }
    }

    public int getKills() {
        return kills;
    }

    IEnumerator SpawnAsteroidField() {
        yield return new WaitForSeconds(2);
        wave.text = "Pass through the asteroid field to get to the enemy base! Shoot asteroids to clear a path!";
        yield return new WaitForSeconds(5);
        wave.text = "";
        asteroidSpawner.SetActive(true);
        yield return new WaitForSeconds(10);
        asteroidSpawner.SetActive(false);
        StartCoroutine(SpawnWave1());
    }
    IEnumerator SpawnWave1() {
        yield return new WaitForSeconds(2);
        wave.text = "Wave 1";
        yield return new WaitForSeconds(5);
        wave.text = "";
        waveSpawnerScript.wave1Spawn();
    }

    IEnumerator SpawnWave2() {
        yield return new WaitForSeconds(2);
        wave.text = "Wave 2";
        yield return new WaitForSeconds(5);
        wave.text = "";
        waveSpawnerScript.wave2Spawn();
    }

    IEnumerator SpawnWave3() {
        yield return new WaitForSeconds(2);
        wave.text = "Wave 3";
        yield return new WaitForSeconds(5);
        wave.text = "";
        waveSpawnerScript.wave3Spawn();
    }
}
