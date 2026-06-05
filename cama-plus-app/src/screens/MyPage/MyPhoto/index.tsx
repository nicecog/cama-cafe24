import React, { useState, useEffect } from 'react';
import { PermissionsAndroid } from 'react-native';
import {
  View,
  Image,
  Pressable,
  Alert,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

/** Types **/
import { MainNavigationScreenProps } from '@/navigations/MainNavigation';

/** Components **/
import LeftBackHeader from '@/components/Headers/LeftBackHeader';

/** Styles **/
import { Inter400Text } from '@/components/Texts/InterText';

/** Utils **/
import { showAlertMessage } from '@/utils/alertMessage';

const MyPhotoScreen: React.FC<
  MainNavigationScreenProps<'MyPhotoScreen'>
> = () => {
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  // 카메라 열기
  const openCamera = () => {
    try {
      console.log('Camera permission given');
      launchCamera(
        {
          mediaType: 'photo',
          quality: 0.1,
          cameraType: 'back',
          saveToPhotos: true,
          includeBase64: true,
        },
        res => {
          if (res.didCancel) {
            console.log('사용자가 취소함');
          } else if (res.errorCode) {
            Alert.alert('에러', res.errorMessage || '알 수 없는 오류');
          } else if (res.assets && res.assets.length > 0) {
            const image = res.assets[0];
            console.log('📷 URI:', image.uri);
            //console.log('🧬 Base64:', image.base64);

            setPreviewUri(image.uri);
            setBase64Image(image.base64);
          }
        },
      );
    } catch (err) {
      console.warn(err);
    }
  };

  //갤러리 사용하기
  const onSelectImage = () => {
    try {
      launchImageLibrary(
        {
          mediaType: 'photo',
          maxWidth: 512,
          includeBase64: true,
        },
        res => {
          if (res.didCancel) {
            console.log('사용자가 취소함');
          } else if (res.errorCode) {
            Alert.alert('에러', res.errorMessage || '알 수 없는 오류');
          } else if (res.assets && res.assets.length > 0) {
            const image = res.assets[0];
            console.log('📷 URI:', image.uri);
            //console.log('🧬 Base64:', image.base64);

            setPreviewUri(image.uri);
            setBase64Image(image.base64);
          }
        },
      );
    } catch (err) {
      console.warn(err);
    }
  };

  // 업로드 함수 -- base64 보내기 (현재 오류로 전송안댐 )
  const uploadImage = async () => {
    const reqDataImage = `data:image/jpeg;base64,${base64Image}`;

    if (!base64Image) {
      showAlertMessage({
        message: '업로드할 이미지를 선택해주세요.',
      });
      return;
    }

    try {
      const response = await fetch(
        'https://camaplus.cafe24.com/api/common/images/base64/upload',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            //  여기를 어케할지.... 모르겟습니다.
            api_key:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJsb2dpbklkIjoiamhwYXJrIiwibmlja05hbWUiOiLrsJXsoJXtmIQiLCJyb2xlcyI6WyJET0NUT1IiXSwiaXNzIjoic3RvLWJhY2siLCJpYXQiOjE3Mjk4NTgzMjksInVzZXJLZXkiOjJ9.HTkgUrjOaPnJ5C8P6rZcx-FNDkA9AiJ_txNkKT39BrwSsv32qHLEfK47fiUTctVv202-jG5JAmc1sX6-c88ivQ', // API 키
          },
          body: JSON.stringify({
            base64: reqDataImage,
          }),
        },
      );

      if (!response.ok) throw new Error('서버 오류');

      const json = await response.json();
      console.log('✅ 업로드 완료:', json);

      // 업로드 성공 후 상태 초기화
      setPreviewUri(null);
      setBase64Image(null);

      showAlertMessage({
        message: '이미지가 성공적으로 업로드되었습니다.',
      });
    } catch (err) {
      console.error('❌ 업로드 실패:', err);

      showAlertMessage({
        message: '이미지 업로드에 실패했습니다.',
      });
    }
  };

  // 업로드한 이미지 삭제
  const clearImage = () => {
    setPreviewUri(null);
    setBase64Image(null); // base64 데이터도 삭제
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <LeftBackHeader title="" />
      <View style={styles.container}>
        {previewUri && (
          <Inter400Text style={{ fontSize: 16, marginBottom: 8, padding: 8 }}>
            파일정보 : {previewUri}
          </Inter400Text>
        )}
        <View style={styles.previewWrapper}>
          {previewUri ? (
            <>
              <Image
                source={{ uri: previewUri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
              <Pressable onPress={clearImage} style={styles.deleteButton}>
                <Inter400Text style={styles.deleteText}>삭제</Inter400Text>
              </Pressable>
            </>
          ) : (
            <View style={styles.skeleton}>
              <Inter400Text style={styles.skeletonText}>
                이미지 미리보기 없음
              </Inter400Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.openButton} onPress={openCamera}>
          <Inter400Text style={styles.openButtonText}>
            📷 카메라로 사진 찍기
          </Inter400Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.openButton} onPress={onSelectImage}>
          <Inter400Text style={styles.openButtonText}>
            📷 갤러리에서 선택
          </Inter400Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            ...styles.openButton,
            backgroundColor: '#007bff',
          }}
          onPress={uploadImage}
        >
          <Inter400Text style={styles.openButtonText}>🛠 파일전송</Inter400Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MyPhotoScreen;

const styles = StyleSheet.create({
  openButton: {
    backgroundColor: '#39906a',
    padding: 14,
    borderRadius: 12,
    marginBottom: 2,
    alignItems: 'center',
  },
  openButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
  },
  previewWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 24,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  skeleton: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  skeletonText: {
    color: '#999',
    fontSize: 16,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#ff4444',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonWrapper: {
    marginBottom: 16,
  },
});
