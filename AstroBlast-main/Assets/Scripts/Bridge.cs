using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System.Runtime.InteropServices;

public class Bridge : MonoBehaviour
{

    // Start is called before the first frame update
    void Start()
    {
        string finalScore = PlayerPrefs.GetString("score");

        // Call the JavaScript function with the final score

        ShowMessage(finalScore);
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    [System.Runtime.InteropServices.DllImport("__Internal")]
    private static extern void ShowMessage(string score);

}
