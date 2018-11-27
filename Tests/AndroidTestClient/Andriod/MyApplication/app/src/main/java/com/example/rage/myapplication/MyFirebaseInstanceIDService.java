package com.example.rage.myapplication;

import android.provider.Settings;
import android.util.Log;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.FirebaseInstanceIdService;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by rage on 1/25/18.
 */

public class MyFirebaseInstanceIDService extends FirebaseInstanceIdService {
    @Override
    public void onTokenRefresh(){
        RequestQueue queue = Volley.newRequestQueue(this);
        String id = FirebaseInstanceId.getInstance().getToken();
        String android_id = Settings.Secure.getString(this.getContentResolver(),
                Settings.Secure.ANDROID_ID);
        JSONObject data = new JSONObject();
        JSONObject data1 = new JSONObject();
        try {

            data1.put("group", "Q");
            data1.put("id", android_id);
            data1.put("notificationToken", id);
            data.put("token",data1);
        }catch (Exception e){

        }
        Log.i("TEST",data.toString());
        String url ="https://us-central1-moving-target-37ff9.cloudfunctions.net/registertoken";
        final JsonObjectRequest jsonObjReq = new JsonObjectRequest(Request.Method.POST,
                url,data,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
//                            Log.i("TEST", response.toString());
                        Log.i("TEST","HI");
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.i("TEST",error.getStackTrace()[0].getLineNumber()+" here");
            }
        });
        queue.add(jsonObjReq);
    }
}
