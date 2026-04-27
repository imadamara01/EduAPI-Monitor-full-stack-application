import { useState, useCallback } from 'react';
import { searchWikipedia, getPageInfo } from '../services/wikiApi';
import { firebaseApi } from '../services/firebaseApi';

export const useApiMonitor = () => {
  const [metrics, setMetrics] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [scatterData, setScatterData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalSearches, setTotalSearches] = useState(0);

  // Charger l'historique au démarrage
  const loadHistory = useCallback(async () => {
    try {
      const response = await firebaseApi.getMetrics(50);
      if (response.success) {
        const history = response.data.map(item => ({
          time: new Date(item.timestamp),
          responseTime: item.response_time || 0,
          query: item.query,
          category: item.category
        }));
        setMetrics(history.reverse());
        setTotalSearches(response.count);
        
        // Reconstruire categoryData à partir de l'historique
        const categories = {};
        response.data.forEach(item => {
          const cat = item.category || 'General';
          categories[cat] = (categories[cat] || 0) + 1;
        });
        const categoryArray = Object.entries(categories).map(([category, count]) => ({
          category,
          count
        }));
        setCategoryData(categoryArray);
        
        // Reconstruire scatterData à partir de l'historique
        const scatterPoints = response.data
          .filter(item => item.results_count > 0)
          .slice(0, 30)
          .map((item, index) => ({
            size: (item.results_count || 1) * 1000,
            responseTime: item.response_time || 0,
            title: item.query || `Search ${index + 1}`,
            ratio: (item.response_time || 0) / ((item.results_count || 1) * 1000)
          }))
          .sort((a, b) => b.ratio - a.ratio)
          .slice(0, 30);
        setScatterData(scatterPoints);
      }
    } catch (error) {
      console.error('Erreur chargement historique:', error.message);
    }
  }, []);

  const performSearch = useCallback(async (query, category = 'General') => {
    setLoading(true);
    try {
      const result = await searchWikipedia(query);
      
      if (!result) return;
      
      // Ajouter aux métriques locales
      setMetrics(prev => [...prev, {
        time: result.timestamp,
        responseTime: result.responseTime,
        query: result.query
      }]);

      // Sauvegarder dans Firebase
      try {
        await firebaseApi.saveMetric({
          query: result.query,
          category: category,
          responseTime: Math.round(result.responseTime),
          resultsCount: result.data?.length || 0
        });
      } catch (error) {
        console.error('Erreur sauvegarde Firebase:', error.message);
      }

      // Mettre à jour les données par catégorie
      setCategoryData(prev => {
        const existing = prev.find(item => item.category === category);
        if (existing) {
          return prev.map(item => 
            item.category === category 
              ? { ...item, count: item.count + 1 }
              : item
          );
        }
        return [...prev, { category, count: 1 }];
      });

      // Ajouter des données scatter
      if (result.success && result.data?.length > 0) {
        const pagePromises = result.data.slice(0, 10).map(page => 
          getPageInfo(page.pageid)
        );
        const pageInfos = await Promise.all(pagePromises);
        
        const newScatterPoints = pageInfos
          .filter(info => info?.success && info.size > 0)
          .map(info => ({
            size: info.size,
            responseTime: info.responseTime,
            title: info.title,
            ratio: info.responseTime / info.size
          }))
          .sort((a, b) => b.ratio - a.ratio)
          .slice(0, 3);
        
        setScatterData(prev => [...prev, ...newScatterPoints].slice(-30));
      }

      return result;
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMetrics = useCallback(async () => {
    try {
      await firebaseApi.clearMetrics();
      setMetrics([]);
      setCategoryData([]);
      setScatterData([]);
      setTotalSearches(0);
    } catch (error) {
      console.error('Erreur suppression:', error.message);
    }
  }, []);

  return {
    metrics,
    categoryData,
    scatterData,
    loading,
    totalSearches,
    performSearch,
    clearMetrics,
    loadHistory
  };
};
