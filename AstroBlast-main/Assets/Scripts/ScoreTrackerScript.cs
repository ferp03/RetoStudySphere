using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ScoreTrackerScript : MonoBehaviour
{
    public Text score;
    public LogicManagerScript logic;
    
    void Start()
    {
        PlayerPrefs.SetString("score", "0");
    }

    // Update is called once per frame
    void Update()
    {
        score.text = "Score: " + logic.getKills().ToString();   
        PlayerPrefs.SetString("score", logic.getKills().ToString());
    }
}
