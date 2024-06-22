using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;
using System.Text;

public class GameOverScript : MonoBehaviour
{
    private LogicManagerScript logic;
    public Text score;
    // Start is called before the first frame update
    void Start()
    {
        string finalScore = PlayerPrefs.GetString("score");
        score.text = "Final Score: " + finalScore;

        // Call the JavaScript function with the final score
        // ShowMessage(finalScore);

        // Post the score to the backend
        StartCoroutine(PostScore(finalScore));
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    // Declare the JavaScript function as an external method
    [System.Runtime.InteropServices.DllImport("__Internal")]
    private static extern void ShowMessage(string score);

    IEnumerator PostScore(string score)
    {
        // Create a new UnityWebRequest and set the URL
        UnityWebRequest www = new UnityWebRequest("https://studysphereserver-fernandos-projects-88891e4a.vercel.app", "POST");

        // Create a JSON object with the score
        string json = JsonUtility.ToJson(new { score = score });

        // Convert the JSON object to a byte array
        byte[] bodyRaw = Encoding.UTF8.GetBytes(json);

        // Set the upload handler and download handler
        www.uploadHandler = new UploadHandlerRaw(bodyRaw);
        www.downloadHandler = new DownloadHandlerBuffer();

        // Set the content type header
        www.SetRequestHeader("Content-Type", "application/json");

        // Send the request and wait for the response
        yield return www.SendWebRequest();

        if (www.result != UnityWebRequest.Result.Success)
        {
            Debug.Log(www.error);
        }
        else
        {
            Debug.Log("Score posted successfully");
        }
    }
}