import { StyleSheet } from "react-native";

const MainStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 20,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginTop: 40,
  },
  titleImage: {
    width: 331,
    height: 140,
    resizeMode: "contain",
  },
  mainText: {
    fontFamily: "Jua-Regular",
    fontSize: 35,
    fontWeight: "400",
    lineHeight: 50,
    letterSpacing: -0.408,
    textAlign: "center",
    color: "white",
    backgroundColor: "transparent",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    justifyContent: "center",
    width: "80%",
    marginBottom: 70,
  },
  button: {
    alignSelf: "center",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  savedSongsButton: {
    backgroundColor: "#3E68FA",
  },
  gradient: {
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignItems: "center",
    width:200,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Jua-Regular",
  },
});

export default MainStyle;
