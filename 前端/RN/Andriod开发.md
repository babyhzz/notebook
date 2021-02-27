# 底部元素防止键盘顶起

指定该属性即可android:windowSoftInputMode="stateAlwaysHidden|adjustPan"

```xml
<activity
  android:name=".MainActivity"
  android:label="@string/app_name"
  android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
  android:launchMode="singleTask"
  android:windowSoftInputMode="stateAlwaysHidden|adjustPan">
  <intent-filter>
  <action android:name="android.intent.action.MAIN" />
  <category android:name="android.intent.category.LAUNCHER" />
  </intent-filter>
 </activity>
```

