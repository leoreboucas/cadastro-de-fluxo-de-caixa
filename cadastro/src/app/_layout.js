import { Stack } from "expo-router"

export default function Layout(){
    return(
        <Stack screenOptions={{
            headerStyle: {
                backgroundColor: "#008000",
            },
            headerTintColor: "#fff",
            

        }}>
            <Stack.Screen name="index" options={{title: "Orçamento"}}/>
            <Stack.Screen name="history/index" options={
                { 
                    title: "Histórico",
                    headerSearchBarOptions: {
                        barTintColor: "#fff",
                        headerIconColor: "#fff",
                    },

                 }}  />
            <Stack.Screen name="register/index" options={{ title: "Registro" }} />
            <Stack.Screen name="results/index" options={{ title: "Resultados" }} />
        </Stack>
    )
}