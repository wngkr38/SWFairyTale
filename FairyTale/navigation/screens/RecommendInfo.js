import React, {useState} from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Linking, TouchableOpacity, Animated, PanResponder  } from 'react-native';
import { BlurView } from 'expo-blur';
import { screenWidth, screenHeight } from '../screenSize';

export default function RecommendInfo ({ route }) {
    const { product } = route.params;
    console.log(product);

    // 가격 문자열에서 숫자만 추출합니다.
    const priceStandard = parseInt(product.priceStandard);
    const priceSales = parseInt(product.priceSales);

    // 가격 비교 후 조건에 따라 스타일을 결정합니다.
    const priceSalesStyle = priceSales < priceStandard ? styles.priceSalesPink : styles.priceSales;
    const priceStandardStyle = priceSales < priceStandard ? [styles.priceStandard, styles.strikeThrough] : styles.priceStandard;

    // 하단 뷰  animated 넣기 //
    const [pan] = useState(new Animated.ValueXY());
    const [visible, setVisible] = useState(true);
  
    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        // 하단 뷰의 맨 위에서 아래로 스와이프할 때만 panResponder를 활성화합니다.
        return gestureState.dy < 0 && gestureState.y0 > 300;
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy < 0) {
          pan.setValue({ x: 0, y: gestureState.dy });
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -100) {
          // 스와이프가 일정 거리 이상일 경우 하단 뷰를 보여줍니다.
          setVisible(true);
        } else {
          // 스와이프가 일정 거리 이하일 경우 하단 뷰를 숨깁니다.
          setVisible(false);
        }
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
      
    });

    const panStyle = {
        transform: [{ translateX: pan.x }, { translateY: pan.y }]
      };
      

    return (
        <View style={{flex:1}}>

           <View style={styles.container}>
                <Image source={{uri: product.cover}} style={StyleSheet.absoluteFill} />
                <BlurView style={StyleSheet.absoluteFill} tint="dark" intensity={45} blurReductionFactor = {6} />

                <View 
                    style={styles.imageBackView}>
                    <View style={styles.imageView}>
                        <Image source={{ uri: product.cover }} style={styles.image} />
                    </View>
                </View>
            </View> 

    {/* {visible && ( */}
        <Animated.View style={[styles.lowerView, panStyle]} {...panResponder.panHandlers}>
        
                {/* <View style={styles.infoBackView}> */}

                    <Text style={styles.title}>{product.title}</Text>
                    <Text style={styles.author}>{product.author}</Text>
                    <Text style={styles.description}>{product.description}</Text>
                    <Text style={styles.categoryName}>{product.categoryName}</Text>

                    <View style={{flexDirection: 'row', alignSelf: 'center', marginTop: '8%'}}>
                        <Text style={styles.TitlePriceStandard}>정가 : </Text>
                        <Text style={priceStandardStyle}>{product.priceStandard}원</Text>
                    </View>
                    <View style={{flexDirection: 'row',  alignSelf: 'center', marginTop: '2%'}}>
                        <Text style={styles.TitlePriceSales}>판매가 : </Text>
                        <Text style={priceSalesStyle}>{product.priceSales}원</Text>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(product.link)}>
                        <Text style={styles.buttonText}>구매하기</Text>
                    </TouchableOpacity>

             
        </Animated.View>  
     

        </View>
    );

};

const styles = StyleSheet.create({
    upperView: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '50%', // 상단 뷰의 높이 조정
        backgroundColor: 'lightblue',
      },
      lowerView: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '40%', // 하단 뷰의 높이 조정
        backgroundColor: 'white',
      },

    container: {
        alignItems: 'center',
        width:'100%',
        flexDirection: 'column',
        backgroundColor: '#fff',
        height: '70%'
    },
    imageBackView: {
        backgroundColor: '#fff',
        width: screenWidth * 250,
        height: screenHeight * 350,
        marginTop: '15%',
        alignItems: 'center',
        // borderColor: 'rgba(0,0,0,0.1)',
        // borderWidth: 2
    },
    imageView: {
        width: screenWidth * 200,
        height: screenHeight * 300,
        borderRadius: 8, 
        alignSelf: 'center',
        marginVertical: '10%',
        elevation: 7,
        shadowColor: '#000',
        shadowOffset: {width:0, height:2},
        shadowOpacity: 0.25,
        shadowRadius: 2,
    },
    image: {
        width: screenWidth * 200,
        height: screenHeight * 300,
        resizeMode: 'cover',
        borderRadius: 8, 
        alignSelf: 'center',
    },
    infoBackView: {
        marginTop:'15%',
        width:'100%', 
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        backgroundColor:'#fff',
    },
    title: {
        fontFamily: 'soyoBold',
        fontSize: screenHeight * 24,
        marginTop: '15%',
        textAlign: 'center',
        lineHeight: screenHeight * 32,
        marginVertical: '5%'
    },
    author: {
        fontFamily: 'soyoRegular',
        fontSize: screenHeight * 18,
        color: 'grey',
        textAlign: 'center',
        marginVertical: '2%'
    },
    description: {
        paddingLeft: '5%',
        paddingRight: '5%',
        fontFamily: 'soyoRegular',
        fontSize: screenHeight * 18,
        marginTop: '5%',
        lineHeight: screenHeight * 30,
        textAlign: 'center'
    },
    categoryName:{
        fontFamily: 'soyoBold',
        fontSize: screenHeight * 12,
        marginLeft: '2%',
        marginTop: '4%'
    },
    TitlePriceStandard: {   // 정가 : 
        fontFamily: 'soyoRegular',
        fontSize: screenHeight * 20,
    },
    priceStandard: {    // 정가 = 판매가 -> 정가
        fontFamily: 'soyoRegular',
        fontSize: screenHeight * 18,
    },
    TitlePriceSales: {  // 판매가 : 
        fontFamily: 'soyoRegular',
        fontSize: screenHeight * 20,
    },
    priceSales: {    // 정가 = 판매가  -> 판매가
        fontFamily: 'soyoRegular',
        fontSize: screenHeight * 18,
    },
    priceSalesPink: {   // 정가 < 판매가
        fontFamily: 'soyoBold',
        fontSize: screenHeight * 18,
        color: '#FF005C',
    },
    strikeThrough:{     // 정가 < 판매가
        fontFamily: 'soyoRegular',
        fontSize: screenHeight * 18,
        textDecorationLine: 'line-through',
    },
    button: {
        marginVertical: '8%',
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 10,
        alignSelf: 'center',
        elevation: 2.5,
        shadowColor: '#000',
        shadowOffset: {width:0, height:2},
        shadowOpacity: 0.35,
        shadowRadius: 1.5
    },
    buttonText: {
        fontFamily:'soyoRegular',
        color: 'white',
        fontSize: screenHeight * 20,
    },
});