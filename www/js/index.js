/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        console.log("ON START");
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        // LocalStorage.clear();
        console.log(window.location.href);
        if((window.location.href).includes("receipt.html")){
            app.useCamera();
        }
        if((window.location.href).includes("myFridge.html")){
            app.populateFridge();
        }
        LocalStorage.initialize();
        this.receivedEvent('deviceready');
        console.log(navigator.camera);
    },
    useCamera: function(){
        console.log(navigator.camera.getPicture(onSuccess, onFail, { quality: 100, correctOrientation: true }));
        console.log("A");
        function onSuccess(imageData) {
            console.log("B");
            app.detectFood(imageData);
        }
        function onFail(message) {
            console.log("C");
          alert('Failed because: ' + message);
        }
    },
    clearFridge: function(){
        LocalStorage.clear();
    },
    detectFood:function(imageData){
        textocr.recText(0, imageData, onSuccess, onFail); // removed returnType (here 3) from version 2.0.0
          // for sourceType Use 0,1,2,3 or 4
          // for returnType Use 0,1,2 or 3 // 3 returns duplicates[see table]
        function onSuccess(recognizedText) {
            //var element = document.getElementById('pp');
            //element.innerHTML=recognizedText;
            //Use above two lines to show recognizedText in html
            // console.log(recognizedText.words.wordtext.join());
            console.log("Scanned");
            var lines = recognizedText.lines.linetext;
            LocalStorage.set("last_scanned",[]);
            for(var i = 0; i < lines.length; i++){
                app.processFoods(lines[i]);
            }
            app.debugOCR();
            app.populateScan();
            // alert(recognizedText.words.wordtext.join());
        }
        function onFail(message) {
            alert('Failed because: ' + message);
        }
    },
    populateScan: function(){
        for(var s of LocalStorage.get("last_scanned")){
            $("#scanned_items").append(('<li class = "scanned-item">            <span style = "width:140px; font-size:10px;">' + s + '<button style = "width:20px; height:20px; padding: 2px;margin:2px;position: absolute;top:145px; left:325px;" onclick="app.editScan()"><img src="icon/edit.jpg" width="10px" height="10px"/></button><button style = "width:20px;height:20px; padding: 2px;margin:2px;position: absolute;top:145px; left:350px;" onclick="app.deleteScan()"><img src="icon/delete.png" width="10px" height="10px"/></button></span></li>'))
        }
    },
    deleteScan: function(item){
        var l = LocalStorage.get("last_scanned");
        var i = l.indexOf(l);
        l.splice(i,1);
        LocalStorage.set("last_scanned",l);
        $('#scanned_items').empty();
        app.populateScan();
    },
    editScan: function(item){
        var l = LocalStorage.get("last_scanned");
        var i = l.indexOf(l);
        l.splice(i,1);
        var ed = prompt("Edit your item: " + item, item);
        if(ed != null && ed.length > 0){
            l.push(ed);
        }
        LocalStorage.set("last_scanned",l);
        $('#scanned_items').empty();
        app.populateScan();
    },
    addItem :function(){
        console.log("hey");
        var l = LocalStorage.get("last_scanned");
        var ed = prompt("Add an item");
        if(ed != null && ed.length > 0){
            l.push(ed);
        }
        LocalStorage.set("last_scanned",l);
        $('#scanned_items').empty();
        app.populateScan();    
    },
    populateFridge: function(){
        var path = "";
        var count = LocalStorage.get("pg_start");
        var l = [];
        for(var s of LocalStorage.get("fruit")){
            l.push(s);
        }
        for(var s of LocalStorage.get("vegetable")){
            l.push(s);
            // $("#fridge_items1").append(('<li style = "display: inline; list-style-type: none;"><div class="" style="float:left"><img style="margin-left:22.5px;margin-right:22.5px; margin-top:10px;"src="' + path + '" width="155px" height="100px"><p class="description"><input style="margin-left:22.5px;margin-right:22.5px;" type="checkbox" name="' + s +'" value="' + s + '" />' + s + '</p></div></li>'))
        }
        for(var s of LocalStorage.get("grain")){
            l.push(s);
            // $("#fridge_items1").append(('<li style = "display: inline; list-style-type: none;"><div class="" style="float:left"><img style="margin-left:22.5px;margin-right:22.5px; margin-top:10px;"src="' + path + '" width="155px" height="100px"><p class="description"><input style="margin-left:22.5px;margin-right:22.5px;" type="checkbox" name="' + s +'" value="' + s + '" />' + s + '</p></div></li>'))
        }
        for(var s of LocalStorage.get("meat")){
            l.push(s);
            // $("#fridge_items1").append(('<li style = "display: inline; list-style-type: none;"><div class="" style="float:left"><img style="margin-left:22.5px;margin-right:22.5px; margin-top:10px;"src="' + path + '" width="155px" height="100px"><p class="description"><input style="margin-left:22.5px;margin-right:22.5px;" type="checkbox" name="' + s +'" value="' + s + '" />' + s + '</p></div></li>'))
        }
        for(var s of LocalStorage.get("processed")){
            l.push(s);
            // $("#fridge_items1").append(('<li style = "display: inline; list-style-type: none;"><div class="" style="float:left"><img style="margin-left:22.5px;margin-right:22.5px; margin-top:10px;"src="' + path + '" width="155px" height="100px"><p class="description"><input style="margin-left:22.5px; margin-right:22.5px;" type="checkbox" name="' + s +'" value="' + s + '" />' + s + '</p></div></li>'))
        }
        if(l.length  > LocalStorage.pg_end){
            return
        }
        $("#fridge_items1").empty();
        $("#fridge_items2").empty();
        console.log(LocalStorage.get("pg_start"));
        console.log(LocalStorage.get("pg_end"));

        for(;count < LocalStorage.get("pg_end");count++){
            console.log(count);
            if(count < LocalStorage.get("pg_end")-2){
                $("#fridge_items1").append(('<li style = "display: inline; list-style-type: none;"><div class="" style="float:left"><img style="margin-left:22.5px;margin-right:22.5px; margin-top:10px;"src="' + path + '" width="155px" height="100px"><p class="description"><input style="margin-left:22.5px;margin-right:22.5px;" type="checkbox" name="' + l[count] +'" value="' + l[count] + '" />' + l[count] + '</p></div></li>'))
                console.log("a");
            }
            else{
                if(count < LocalStorage.get("pg_end")){
                    $("#fridge_items2").append(('<li style = "display: inline; list-style-type: none;"><div class="" style="float:left"><img style="margin-left:22.5px;margin-right:22.5px; margin-top:10px;"src="' + path + '" width="155px" height="100px"><p class="description"><input style="margin-left:22.5px;margin-right:22.5px;" type="checkbox" name="' + l[count] +'" value="' + l[count] + '" />' + l[count] + '</p></div></li>'))
                    console.log("b");
                }
            }
        }

    },
    scanReceipt:function(){
        window.location="receipt.html";
        $.mobile.pageContainer.pagecontainer("change", "#receipt", { changeHash: true, transition: "none" });
        // app.useCamera();
        console.log("Finished");
    },
    prevFour: function(){
        console.log("Prev Four");
        var s = LocalStorage.get("pg_start");
        if(s > 3 ){
            LocalStorage.set("pg_start",s - 4);
            LocalStorage.set("pg_end",LocalStorage.get("pg_end") - 4)            
        }
        else{
            return;
        }
        app.populateFridge();
    },
    nextFour: function(){
            console.log("Next Four");
            LocalStorage.set("pg_start",LocalStorage.get("pg_start") + 4);
            LocalStorage.set("pg_end",LocalStorage.get("pg_end") + 4)            
        app.populateFridge();
    },
    debugOCR: function(){
        console.log("Fruits: " + LocalStorage.get("fruit").join());
        console.log("Vegetables: " + LocalStorage.get("vegetable").join());
        console.log("Grain: " + LocalStorage.get("grain").join());
        console.log("Meat: " + LocalStorage.get("meat").join());
        console.log("Processed: " + LocalStorage.get("processed").join());
    },
    processFoods: function(text){
        var text = (text.replace(/[0-9]/g, '')).toLowerCase();
        for(var s of Constants.FRUIT){
            if(text.includes(s)){
                console.log("T: " + text + ", S: " + s);
                var t = LocalStorage.get("fruit");
                t.push(s);
                LocalStorage.set("fruit",t);
                t = LocalStorage.get("last_scanned");
                t.push(s);
                LocalStorage.set("last_scanned",t);
                return
            }
        }
        for(var s of Constants.VEGETABLE){
            if(text.includes(s)){
                console.log("T: " + text + ", S: " + s);
                var t = LocalStorage.get("vegetable");
                t.push(s);
                LocalStorage.set("vegetable",t);
                t = LocalStorage.get("last_scanned");
                t.push(s);
                LocalStorage.set("last_scanned",t);
                return
            }
        }
        for(var s of Constants.GRAIN){
            if(text.includes(s)){
                console.log("T: " + text + ", S: " + s);
                var t = LocalStorage.get("grain");
                t.push(s);
                LocalStorage.set("grain",t);
                t = LocalStorage.get("last_scanned");
                t.push(s);
                LocalStorage.set("last_scanned",t);
                return
            }
        }
        for(var s of Constants.MEAT){
            if(text.includes(s)){
                console.log("T: " + text + ", S: " + s);
                var t = LocalStorage.get("meat");
                t.push(s);
                LocalStorage.set("meat",t);
                t = LocalStorage.get("last_scanned");
                t.push(s);
                LocalStorage.set("last_scanned",t);
                return
            }
        }
        for(var s of Constants.PROCESSED){
            if(text.includes(s)){
                console.log("T: " + text + ", S: " + s);
                var t = LocalStorage.get("processed");
                t.push(s);
                LocalStorage.set("processed",t);
                t = LocalStorage.get("last_scanned");
                t.push(s);
                LocalStorage.set("last_scanned",t);
                return
            }
        }
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        // console.log('Received Event: ' + id);
    }
};

app.initialize();