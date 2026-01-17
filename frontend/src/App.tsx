import { useState } from 'react';
import { VizScene } from './components/VizScene';
import { SearchOverlay } from './components/SearchOverlay';
import { MusicPlayer } from './components/MusicPlayer';
import type { GraphData } from './components/Graph';

function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GraphData | null>(null);
  const [shouldPlayMusic, setShouldPlayMusic] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setShouldPlayMusic(true);
    try {
      const API_KEY = 'AIzaSyCKztC6DwOLkOGnSn2yOP-a7FIEakFVdMU';
      console.log(`Fetching from Google KG with query: ${query}`);
      const res = await fetch(`https://kgsearch.googleapis.com/v1/entities:search?query=${encodeURIComponent(query)}&key=${API_KEY}&limit=6&indent=True`);

      console.log(`Response status: ${res.status}`);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Network response was not ok: ${res.status} ${res.statusText} - ${errorText}`);
      }

      const result = await res.json();
      console.log("API Result JSON:", result);

      // Extract "real" answer
      const topItem = result.itemListElement?.[0]?.result;
      const realAnswer = topItem?.detailedDescription?.articleBody
        || topItem?.description
        || "No detailed answer found in Knowledge Graph.";

      // Split KG results into general entities and "papers" (CreativeWorks/Books/Articles)
      const allItems = result.itemListElement || [];
      const kgEntities = [];
      const paperEntities = [];

      for (const item of allItems) {
        const types = item.result['@type'] || [];
        if (types.includes('Book') || types.includes('ScholarlyArticle') || types.includes('CreativeWork')) {
          paperEntities.push(item);
        } else {
          kgEntities.push(item);
        }
      }

      // Transform Google KG response to GraphData
      const graphData: GraphData = {
        question: query,
        answer: realAnswer,
        context: {
          kg: { itemListElement: kgEntities },
          papers: { itemListElement: paperEntities }
        }
      };

      setData(graphData);
    } catch (error) {
      console.error("Search failed:", error);
      alert(`Search failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SearchOverlay onSearch={handleSearch} loading={loading} />
      <VizScene data={data} />
      <MusicPlayer playTrigger={shouldPlayMusic} />
    </>
  );
}

export default App;
