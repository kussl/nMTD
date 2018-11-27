package com.example.rage.myapplication;


import android.util.Log;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import org.json.JSONObject;

/**
 * Created by rage on 1/25/18.
 */

public class MyFirebaseMessagingService extends FirebaseMessagingService {
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage){
        JSONObject r = new JSONObject(remoteMessage.getData());
//        Log.i("TEST",r.toString());
    }

}
