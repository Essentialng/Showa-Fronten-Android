// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   SafeAreaView,
//   ActivityIndicator,
// } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";
// import { API_ROUTE_IMAGE, API_ROUTE } from "../api_routing/api";
// import Signaling from "./signaling"; 
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const { width } = Dimensions.get("window");

// export default function LivePage({ navigation }) {
//   const [liveStreams, setLiveStreams] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const signaling = useRef(null);

//   // Fetch live streams from API
//   const fetchLiveStreams = async () => {
//     try {
//     const token = await AsyncStorage.getItem("userToken"); 
//       const res = await fetch(`${API_ROUTE}/live-streams/`, {
//      method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`, 
//       },
//       });
      
//       const data = await res.json();
//       console.log("Fetching live streams from API...",data);
//       setLiveStreams(data);
//       setLoading(false);
//     } catch (err) {
//       console.warn("Error fetching live streams:", err);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLiveStreams();

//     // Initialize signaling for real-time updates
//     signaling.current = new Signaling("live-page", onSignalingMessage);
//     signaling.current.connect();

//     return () => {
//       signaling.current?.close();
//     };
//   }, []);

//   // Handle real-time signaling messages
//   const onSignalingMessage = (msg) => {
//     if (!msg || !msg.type) return;

//     // Viewer count or likes update
//     if (msg.type === "live-stream-update") {
//       setLiveStreams((prev) =>
//         prev.map((stream) =>
//           stream.stream_id === msg.streamId
//             ? { ...stream, viewer_count: msg.viewer_count, likes: msg.likes }
//             : stream
//         )
//       );
//     }
//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.streamCard}
//       onPress={() =>
//         navigation.navigate("Viewer", {
//         roomName: `user-${item.broadcaster_name}`,
//         streamId: `stream-${item.broadcaster_name}`,
//         viewerId: 'viewer-1',
//         })
//       }
//     >
//       {item.broadcaster_image ? (
//         <Image
//           source={{ uri: `${item.broadcaster_image}` }}
//           style={styles.broadcasterImage}
//         />
//       ) : (
//         <View style={styles.broadcasterImagePlaceholder}>
//           <Text style={styles.broadcasterInitial}>
//             {item.broadcaster_name.charAt(0).toUpperCase()}
//           </Text>
//         </View>
//       )}
//       <View style={styles.streamInfo}>
//         <Text style={styles.broadcasterName}>{item.broadcaster_name}</Text>
//         <View style={styles.liveBadge}>
//           <View style={styles.liveDot} />
//           <Text style={styles.liveText}>LIVE</Text>
//         </View>
//         <Text style={styles.statsText}>
//           {item.viewer_count} viewers • {item.likes} likes
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#ff375f" />
//       </View>
//     );
//   }

//   if (!liveStreams.length) {
//     return (
//       <View style={styles.emptyContainer}>
//         <Text style={styles.emptyText}>No broadcasters live right now.</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <FlatList
//         data={liveStreams}
//         keyExtractor={(item) => item.stream_id}
//         renderItem={renderItem}
//         contentContainerStyle={styles.listContent}
//         showsVerticalScrollIndicator={false}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//   },
//   listContent: {
//     paddingVertical: 15,
//     paddingHorizontal: 10,
//   },
//   streamCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "rgba(255,255,255,0.05)",
//     borderRadius: 15,
//     marginBottom: 12,
//     padding: 10,
//   },
//   broadcasterImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     marginRight: 12,
//   },
//   broadcasterImagePlaceholder: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "#555",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   broadcasterInitial: {
//     color: "#fff",
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   streamInfo: {
//     flex: 1,
//   },
//   broadcasterName: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 4,
//   },
//   liveBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "rgba(255,0,0,0.8)",
//     paddingHorizontal: 10,
//     paddingVertical: 2,
//     borderRadius: 12,
//     alignSelf: "flex-start",
//     marginBottom: 4,
//   },
//   liveDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "#fff",
//     marginRight: 6,
//   },
//   liveText: {
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: "bold",
//   },
//   statsText: {
//     color: "#fff",
//     fontSize: 12,
//     opacity: 0.8,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#000",
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#000",
//   },
//   emptyText: {
//     color: "#fff",
//     fontSize: 16,
//     opacity: 0.7,
//   },
// });

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Animated,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from 'react-native-linear-gradient';
import { API_ROUTE_IMAGE, API_ROUTE } from "../api_routing/api";
import Signaling from "./signaling"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export default function LivePage({ navigation }) {
  const [liveStreams, setLiveStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const signaling = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [userName, setUserName] = useState('');


  useEffect(()=>{
  
        const fetchUserData =async () =>{
  
          try {
  
          const userDataString = await AsyncStorage.getItem('userData');
                        const userData = userDataString ? JSON.parse(userDataString) : null;
                        //console.log('User Dataaaaaa:', userData);
                        const userId = userData?.id || 'unknown';
                        const username = userData?.name || 'unknown';
                        setUserName(username)
                        //console.log('usernamennnn', username)
          
        } catch (error) {
          
          
        }
  
        }
  
        fetchUserData()
        
      },[])

  // Fetch live streams from API
  const fetchLiveStreams = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken"); 
      const res = await fetch(`${API_ROUTE}/live-streams/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
      });
      
      const data = await res.json();
      //console.log("Fetching live streams from API...", data);
      setLiveStreams(data);
      
      // Animate content in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
      
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      //console.warn("Error fetching live streams:", err);
      setLoading(false);
      setRefreshing(false);
    }
  };




  const onRefresh = () => {
    setRefreshing(true);
    fetchLiveStreams();
  };

  useEffect(() => {
    fetchLiveStreams();

    // Initialize signaling for real-time updates
    signaling.current = new Signaling("live-page", onSignalingMessage);
    signaling.current.connect();

    return () => {
      signaling.current?.close();
    };
  }, []);

  // Handle real-time signaling messages
  const onSignalingMessage = (msg) => {
    if (!msg || !msg.type) return;

    if (msg.type === "live-stream-update") {
      setLiveStreams((prev) =>
        prev.map((stream) =>
          stream.stream_id === msg.streamId
            ? { 
                ...stream, 
                viewer_count: msg.viewer_count, 
                likes: msg.likes,
                // Add pulse animation for updates
                updated: true 
              }
            : stream
        )
      );
    }
  };

  const StreamCard = ({ item, index }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    };

    const startGlowAnimation = () => {
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    };

    React.useEffect(() => {
      if (item.updated) {
        startGlowAnimation();
        // Reset updated flag after animation
        setTimeout(() => {
          setLiveStreams(prev => 
            prev.map(stream => 
              stream.stream_id === item.stream_id 
                ? { ...stream, updated: false } 
                : stream
            )
          );
        }, 1000);
      }
    }, [item.updated]);

    return (
      <Animated.View
        style={[
          styles.streamCard,
          {
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() =>
            navigation.navigate("Viewer", {
              roomName: `user-${item.broadcaster_name}`,
              streamId: `stream-${item.broadcaster_name}`,
              viewerId: 'viewer-1',
            })
          }
        >
          {/* Live Indicator Glow */}
          <Animated.View
            style={[
              styles.liveGlow,
              {
                opacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 0.8],
                }),
              },
            ]}
          />
          
          <LinearGradient
            colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Header with broadcaster info */}
            <View style={styles.cardHeader}>
              <View style={styles.broadcasterInfo}>
                {item.broadcaster_image ? (
                  <Image
                    source={{ uri: `${item.broadcaster_image}` }}
                    style={styles.broadcasterImage}
                  />
                ) : (
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.broadcasterImagePlaceholder}
                  >
                    <Text style={styles.broadcasterInitial}>
                      {item.broadcaster_name.charAt(0).toUpperCase()}
                    </Text>
                  </LinearGradient>
                )}
                <View style={styles.broadcasterDetails}>
                  <Text style={styles.broadcasterName} numberOfLines={1}>
                    {item.broadcaster_name}
                  </Text>
                  <Text style={styles.streamCategory}>Just Chatting</Text>
                </View>
              </View>
              
              {/* Live Badge */}
              <LinearGradient
                colors={['#FF416C', '#FF4B2B']}
                style={styles.liveBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.livePulse} />
                <Text style={styles.liveText}>LIVE</Text>
              </LinearGradient>
            </View>

            {/* Stream Preview Area */}
            <View style={styles.streamPreview}>
              <LinearGradient
                colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.1)']}
                style={styles.previewPlaceholder}
              >
                <Icon name="videocam" size={40} color="rgba(255,255,255,0.7)" />
                <Text style={styles.previewText}>Live Stream Preview</Text>
              </LinearGradient>
              
              {/* Viewer Count Overlay */}
              <View style={styles.viewerOverlay}>
                <LinearGradient
                  colors={['rgba(0,0,0,0.7)', 'transparent']}
                  style={styles.viewerGradient}
                >
                  <View style={styles.viewerCount}>
                    <Icon name="people" size={14} color="#fff" />
                    <Text style={styles.viewerCountText}>
                      {item.viewer_count} watching
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            </View>

            {/* Stream Stats */}
            <View style={styles.streamStats}>
              <View style={styles.statItem}>
                <Icon name="heart" size={16} color="#FF416C" />
                <Text style={styles.statText}>{item.likes}</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="chatbubble" size={16} color="#4FC3F7" />
                <Text style={styles.statText}>{item.comments || 0}</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="time" size={16} color="#81C784" />
                <Text style={styles.statText}>2h ago</Text>
              </View>
            </View>

            {/* Join Stream Button */}
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() =>
                navigation.navigate("Viewer", {
                  roomName: `user-${item.broadcaster_name}`,
                  streamId: `stream-${item.broadcaster_name}`,
                  viewerId: 'viewer-1',
                })
              }
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.joinButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Icon name="play" size={20} color="#fff" />
                <Text style={styles.joinButtonText}>Watch Stream</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const LoadingSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3].map((item) => (
        <View key={item} style={styles.skeletonCard}>
          <View style={styles.skeletonHeader}>
            <View style={styles.skeletonAvatar} />
            <View style={styles.skeletonText}>
              <View style={styles.skeletonLine} />
              <View style={[styles.skeletonLine, { width: '60%' }]} />
            </View>
          </View>
          <View style={styles.skeletonPreview} />
          <View style={styles.skeletonStats} />
          <View style={styles.skeletonButton} />
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Live Streams</Text>
          <Text style={styles.headerSubtitle}>Discover amazing content</Text>
        </View>
        <LoadingSkeleton />
      </SafeAreaView>
    );
  }

  if (!liveStreams.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Live Streams</Text>
          <Text style={styles.headerSubtitle}>Discover amazing content</Text>
        </View>
        <View style={styles.emptyContainer}>
          <LinearGradient
            colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
            style={styles.emptyGradient}
          >
            <Icon name="radio" size={80} color="rgba(255,255,255,0.3)" />
            <Text style={styles.emptyTitle}>No Live Streams</Text>
            <Text style={styles.emptyText}>
              There are no broadcasters live right now. 
              Check back later or be the first to go live!
            </Text>
            <TouchableOpacity 
              style={styles.goLiveButton}
              onPress={async () => {
                     
                
                      navigation.navigate('Broadcaster', {
                        roomName: `user-${userName}`,
                        streamId: `stream-${userName}`,
                        // userName: userData?.name || 'User',
                        // userId: userId
                      });
                    }}
            >
              <LinearGradient
                colors={['#FF416C', '#FF4B2B']}
                style={styles.goLiveGradient}
              >
                <Icon name="radio" size={20} color="#fff" />
                <Text style={styles.goLiveText}>Go Live</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Streams</Text>
        <Text style={styles.headerSubtitle}>
          {liveStreams.length} stream{liveStreams.length !== 1 ? 's' : ''} live now
        </Text>
      </View>

      {/* Live Streams List */}
      <FlatList
        data={liveStreams}
        keyExtractor={(item) => item.stream_id}
        renderItem={({ item, index }) => (
          <StreamCard item={item} index={index} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#667eea', '#764ba2']}
            tintColor="#667eea"
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={async () => {
                     
                
                      navigation.navigate('Broadcaster', {
                        roomName: `user-${userName}`,
                        streamId: `stream-${userName}`,
                        // userName: userData?.name || 'User',
                        // userId: userId
                      });
                    }}
      >
        <LinearGradient
          colors={['#FF416C', '#FF4B2B']}
          style={styles.fabGradient}
        >
          <Icon name="add" size={24} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "System",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.6)",
    fontFamily: "System",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  streamCard: {
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  liveGlow: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    backgroundColor: '#FF416C',
    borderRadius: 25,
    zIndex: -1,
  },
  cardGradient: {
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  broadcasterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  broadcasterImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  broadcasterImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  broadcasterInitial: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  broadcasterDetails: {
    flex: 1,
  },
  broadcasterName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  streamCategory: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
  },
  livePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    marginRight: 6,
  },
  liveText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },
  streamPreview: {
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  previewPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginTop: 8,
  },
  viewerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  viewerGradient: {
    padding: 12,
  },
  viewerCount: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  viewerCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  streamStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  joinButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  joinButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    shadowColor: '#FF416C',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Loading Skeleton Styles
  skeletonContainer: {
    padding: 16,
  },
  skeletonCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  skeletonAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 12,
  },
  skeletonText: {
    flex: 1,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    marginBottom: 8,
    width: '80%',
  },
  skeletonPreview: {
    height: 180,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    marginBottom: 16,
  },
  skeletonStats: {
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    marginBottom: 16,
  },
  skeletonButton: {
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyGradient: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 20,
    width: '100%',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 20,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  goLiveButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  goLiveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  goLiveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
