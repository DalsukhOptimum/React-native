import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container : {
        flex: 1,
        justifyContent: 'center',
        alignItems : "center",
        // paddingTop: 70,
        backgroundColor: '#93D3D7'
      },
      image : {
        height : 160,
        width : 170
      },
      title : {
        fontSize : 30,
        fontWeight : "bold",
        textTransform : "uppercase",
        textAlign: "center",
        paddingVertical : 40,
        color : "black"
      },
      inputView : {
        gap : 15,
        width : "100%",
        paddingHorizontal : 40,
        marginBottom  :5
      },
      input : {
        height : 50,
        paddingHorizontal : 20,
        borderColor : "black",
        borderWidth : 1,
        borderRadius: 7,
        color: '#000'
      },
      rememberView : {
        width : "100%",
        paddingHorizontal : 50,
        justifyContent: "space-between",
        alignItems : "center",
        flexDirection : "row",
        marginBottom : 8
      },
      switch :{
        flexDirection : "row",
        gap : 1,
        justifyContent : "center",
        alignItems : "center"
        
      },
      rememberText : {
        fontSize: 13
      },
      forgetText : {
        fontSize : 11,
        color : "red"
      },
      button : {
        backgroundColor : "blue",
        height : 45,
        borderColor : "gray",
        borderWidth  : 1,
        borderRadius : 5,
        alignItems : "center",
        justifyContent : "center",
        marginTop:10
      },
      buttonText : {
        color : "white"  ,
        fontSize: 18,
        fontWeight : "bold"
      }, 
      buttonView :{
        width :"100%",
        paddingHorizontal : 50
      },
      optionsText : {
        textAlign : "center",
        paddingVertical : 10,
        color : "gray",
        fontSize : 13,
        marginBottom : 6
      },
      mediaIcons : {
        flexDirection : "row",
        gap : 15,
        alignItems: "center",
        justifyContent : "center",
        marginBottom : 23
      },
      icons : {
        width : 40,
        height: 40,
      },
      footerText : {
        textAlign: "center",
        color : "gray",
      },
      signup : {
        color : "red",
        fontSize : 13
      }
})