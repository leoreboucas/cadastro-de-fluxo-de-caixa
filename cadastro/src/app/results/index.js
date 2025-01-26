import { Button, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { checkTables } from '../../database/initializeDatabase';
import Receitas from './receitas';

export default function Results() {
  const router = useRouter();
  const [dados, setDados] = useState([])

  const fetchData =  async () => {
    try {
                const result = await checkTables('cadastro');
                if (Array.isArray(result)) {
                    setDados(result)
                }
            } catch (err) {
                console.log(err)
            }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Receitas dados= {dados} />
  );
}
