import { Stack, Slot } from "expo-router";
import {SQLiteProvider} from 'expo-sqlite';
import { initializeDatabase } from "../database/initializeDatabase";

export default function Layout(){
    return(
        <SQLiteProvider databaseName="registros.db" onInit={initializeDatabase}>
            <Stack screenOptions={{
                headerStyle: {
                    backgroundColor: "#008000",
                },
                headerTintColor: "#fff",
            }}>
                <Stack.Screen name="index" options={{ title: "Orçamento" }} />
                <Stack.Screen name="products/index" options={{ title: "Produtos Salvos" }} />
                <Stack.Screen name="history/index" options={
                    {
                        title: "Histórico",
                        headerSearchBarOptions: {
                            barTintColor: "#fff",
                            headerIconColor: "#fff",
                        },

                    }} />
                <Stack.Screen name="register/index" options={{ title: "Registro" }} />
                <Stack.Screen name="results/index" options={{ title: "Resultados" }} />
            </Stack>
        </SQLiteProvider>
        
    )
}