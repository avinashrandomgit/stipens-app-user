import { NativeTabs } from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";

const useNativeTabs = Platform.OS === "ios";

export default function TabLayout() {
  return (
    <NativeTabs
      backgroundColor={"#fff"}
      tintColor={"#13a876"}
      iconColor={{ default: "#13a876", selected: "#13a876" }}
      labelStyle={{
        default: { color: "#13a876" },
        selected: { color: "#13a876" },
      }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="transactions">
        <NativeTabs.Trigger.Label>Transactions</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="creditcard.fill"
          md="account_balance_wallet"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="add-transactions">
        <NativeTabs.Trigger.Label>Add</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="plus.circle.fill" md="add_circle" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="assistant">
        <NativeTabs.Trigger.Label>Assistant</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="sparkles" md="auto_awesome" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
  // if (useNativeTabs) {
  //   return (
  //     <NativeTabs
  //       backgroundColor={"#0B0E14"}
  //       tintColor={"#4A9EFF"}
  //       iconColor={{ default: "#5C5F68", selected: "#4A9EFF" }}
  //       labelStyle={{
  //         default: { color: "#5C5F68" },
  //         selected: { color: "#4A9EFF" },
  //       }}
  //     >
  //       <NativeTabs.Trigger name="index">
  //         <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
  //         <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
  //       </NativeTabs.Trigger>
  //       <NativeTabs.Trigger name="transactions">
  //         <NativeTabs.Trigger.Label>Transactions</NativeTabs.Trigger.Label>
  //         <NativeTabs.Trigger.Icon
  //           sf="creditcard.fill"
  //           md="account_balance_wallet"
  //         />
  //       </NativeTabs.Trigger>
  //       <NativeTabs.Trigger name="add-transactions">
  //         <NativeTabs.Trigger.Label>Add</NativeTabs.Trigger.Label>
  //         <NativeTabs.Trigger.Icon sf="plus.circle.fill" md="add_circle" />
  //       </NativeTabs.Trigger>
  //       <NativeTabs.Trigger name="assistant">
  //         <NativeTabs.Trigger.Label>Assistant</NativeTabs.Trigger.Label>
  //         <NativeTabs.Trigger.Icon sf="sparkles" md="auto_awesome" />
  //       </NativeTabs.Trigger>
  //       <NativeTabs.Trigger name="profile">
  //         <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
  //         <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
  //       </NativeTabs.Trigger>
  //     </NativeTabs>
  //   );
  // } else {
  //   return (
  //     <Tabs
  //       screenOptions={{
  //         headerShown: false,
  //         tabBarActiveTintColor: "#4A9EFF",
  //         tabBarInactiveTintColor: "#5C5F68",
  //         tabBarStyle: {
  //           backgroundColor: "#FFFFFF",
  //           borderTopColor: "#E8E6DF",
  //           // paddingTop: 4,
  //           paddingBottom: 10,
  //           height: 70,
  //         },
  //       }}
  //     >
  //       <Tabs.Screen
  //         name="index"
  //         options={{
  //           title: "Home",
  //           tabBarIcon: ({ color, size }) => (
  //             <Feather name="home" size={size} color={color} />
  //           ),
  //         }}
  //       />
  //       <Tabs.Screen
  //         name="transactions"
  //         options={{
  //           title: "Transactions",
  //           tabBarIcon: ({ color, size }) => (
  //             <Feather name="list" size={size} color={color} />
  //           ),
  //         }}
  //       />
  //       <Tabs.Screen
  //         name="add-transaction"
  //         options={{
  //           title: "Add",
  //           tabBarIcon: ({ color, size }) => (
  //             <Feather name="plus-circle" size={size} color={color} />
  //           ),
  //         }}
  //       />
  //       <Tabs.Screen
  //         name="assistant"
  //         options={{
  //           title: "Assistant",
  //           tabBarIcon: ({ color, size }) => (
  //             <Feather name="cpu" size={size} color={color} />
  //           ),
  //         }}
  //       />
  //       <Tabs.Screen
  //         name="profile"
  //         options={{
  //           title: "Profile",
  //           tabBarIcon: ({ color, size }) => (
  //             <Feather name="user" size={size} color={color} />
  //           ),
  //         }}
  //       />
  //     </Tabs>
  //   );
  // }
}
