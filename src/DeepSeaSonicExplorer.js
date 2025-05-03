import React, { useState, useEffect } from 'react';
import { Play, Pause, MapPin, Compass, Thermometer, Droplets, Layers, Clock, Fish, Moon, Sun } from 'lucide-react';
import * as Tone from 'tone';

const DeepSeaSonicExplorer = () => {
  // State for coordinates, environment parameters and playback
  const [isPlaying, setIsPlaying] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: 14.5, lng: -125.0 });
  const [depth, setDepth] = useState(4500);
  const [temperature, setTemperature] = useState(1.5);
  const [oxygen, setOxygen] = useState(3.5);
  const [time, setTime] = useState(new Date());
  const [currentBiome, setCurrentBiome] = useState('abyssal-plain');
  const [audioElements, setAudioElements] = useState(null);
  const [activeMarineLife, setActiveMarineLife] = useState([]);
  
  // CCZ region boundaries
  const CCZ_BOUNDS = {
    north: 20, // Clarion Fracture Zone (approximate)
    south: 5,  // Clipperton Fracture Zone (approximate)
    west: -160,
    east: -115
  };
  
  // Biome types in the CCZ
  const BIOMES = [
    { id: 'abyssal-plain', name: 'Abyssal Plain', depthRange: [4000, 5000] },
    { id: 'seamount', name: 'Seamount', depthRange: [2000, 4000] },
    { id: 'fracture-zone', name: 'Fracture Zone', depthRange: [5000, 6000] },
    { id: 'nodule-field', name: 'Nodule Field', depthRange: [4200, 5500] }
  ];
  
  // Marine life that might be encountered
  const MARINE_LIFE = [
    { id: 'rattail-fish', name: 'Rattail Fish', depth: [3500, 5500], frequency: 0.3, soundProfile: 'mid-low' },
    { id: 'sea-cucumber', name: 'Sea Cucumber (Amperima)', depth: [4000, 5000], frequency: 0.7, soundProfile: 'low' },
    { id: 'glass-sponge', name: 'Glass Sponge', depth: [3000, 6000], frequency: 0.6, soundProfile: 'high' },
    { id: 'sea-anemone', name: 'Sea Anemone', depth: [3500, 5500], frequency: 0.5, soundProfile: 'mid' },
    { id: 'xenophyophore', name: 'Xenophyophore', depth: [4000, 6000], frequency: 0.8, soundProfile: 'low-mid' },
    { id: 'polynoid-worm', name: 'Polynoid Worm', depth: [4000, 5500], frequency: 0.7, soundProfile: 'high-mid' },
    { id: 'sea-pig', name: 'Sea Pig (Barbie Pig)', depth: [4500, 5500], frequency: 0.6, soundProfile: 'low' },
    { id: 'transparent-unicumber', name: 'Transparent Unicumber', depth: [4500, 5500], frequency: 0.5, soundProfile: 'high' },
    { id: 'ping-pong-sponge', name: 'Ping Pong Sponge', depth: [4000, 5000], frequency: 0.3, soundProfile: 'mid-high' },
    { id: 'brittle-star', name: 'Brittle Star', depth: [3500, 5500], frequency: 0.6, soundProfile: 'mid' },
    { id: 'gummy-squirrel', name: 'Abyssal Gummy Squirrel', depth: [4800, 5500], frequency: 0.4, soundProfile: 'low-mid' }
  ];
  
  // Determine which marine life might be present based on current parameters
  useEffect(() => {
    if (!isPlaying) return;
    
    const determineActiveMarineLife = () => {
      // Filter marine life based on current depth and random chance based on frequency
      return MARINE_LIFE.filter(creature => {
        const inDepthRange = depth >= creature.depth[0] && depth <= creature.depth[1];
        const randomPresence = Math.random() < creature.frequency;
        return inDepthRange && randomPresence;
      });
    };
    
    const lifeInterval = setInterval(() => {
      setActiveMarineLife(determineActiveMarineLife());
    }, 5000); // Check for new creatures every 5 seconds
    
    return () => clearInterval(lifeInterval);
  }, [isPlaying, depth]);
  
  // Generate music based on all parameters when playing
  useEffect(() => {
    if (!audioElements || !isPlaying) return;
    
    // This would contain the actual Tone.js music generation logic
    // For demonstration purposes, we'll just log the parameters that would affect the sound
    
    // Parameters that would influence the music:
    // 1. Depth - affects pitch range and reverb
    // 2. Temperature - affects timbre and tone color
    // 3. Oxygen - affects activity level and rhythm density
    // 4. Time of day - affects overall mood and harmony
    // 5. Biome - affects base ambient sounds
    // 6. Active marine life - triggers specific musical motifs
    
    // Set base ambient sound parameters based on depth
    const depthRatio = (depth - 2000) / 4000; // Normalized depth (2000m to 6000m)
    const depthPitch = Tone.Frequency("C2").transpose(-12 * depthRatio);
    
    // Temperature affects timbre (filter cutoff)
    const tempFilterFreq = 300 + (temperature * 200);
    audioElements.effects.filter.frequency.value = tempFilterFreq;
    
    // Oxygen affects rhythm intensity
    const rhythmRate = 0.2 + (oxygen * 0.1);
    
    // Start the noise for water ambient
    audioElements.noise.volume.value = -25 - (depthRatio * 5);
    audioElements.noise.start();
    
    // Example of playing a chord based on the biome
    let biomeChord;
    switch(currentBiome) {
      case 'abyssal-plain':
        biomeChord = ["C2", "G2", "C3", "E3"];
        break;
      case 'seamount':
        biomeChord = ["D2", "A2", "D3", "F#3"];
        break;
      case 'fracture-zone':
        biomeChord = ["B1", "F#2", "B2", "D3"];
        break;
      case 'nodule-field':
        biomeChord = ["E2", "B2", "E3", "G3"];
        break;
      default:
        biomeChord = ["C2", "G2", "C3", "E3"];
    }
    
    // Play the ambient chord
    audioElements.ambientSynth.triggerAttackRelease(biomeChord, "8n");
    
    // For each active marine life, play its characteristic sound
    const scaleMidi = [60, 62, 64, 65, 67, 69, 71, 72]; // C major
    const predatorIds = ['gulper-eel', 'predatory-fish', 'giant-squid']; // Add your predator IDs here
    const playLifeSounds = () => {
      activeMarineLife.forEach(creature => {
        let synth = audioElements.creatureSynths[creature.soundProfile];
        let isPredator = predatorIds.includes(creature.id);
        if (isPredator) synth = audioElements.creatureSynths['predator'];
        if (!synth) return;
        // Quantize to scale
        let midi = scaleMidi[Math.floor(Math.random() * scaleMidi.length)];
        if (isPredator) midi -= 12; // Lower octave for drama
        let note = Tone.Frequency(midi, 'midi').toNote();
        // Play with drama for predator
        let now = Tone.now();
        let offset = Math.random() * 0.05; // up to 50ms random offset
        if (isPredator) {
          synth.triggerAttackRelease(note, 1.5, now + offset, 1.0);
          audioElements.effects.reverb.decay = 8;
          audioElements.effects.filter.frequency.value = 200;
        } else {
          if (Math.random() < 0.5) {
            synth.triggerAttackRelease(note, Math.random() * 1.2 + 0.3, now + offset, 0.5);
          }
          audioElements.effects.reverb.decay = 5;
          audioElements.effects.filter.frequency.value = 300 + (temperature * 200);
        }
      });
    };
    
    // Set up recurring events for ambient sounds
    const ambientInterval = setInterval(() => {
      audioElements.ambientSynth.triggerAttackRelease(biomeChord, "8n");
    }, 10000); // Play ambient chord every 10 seconds
    
    // Set up recurring events for creature sounds
    const creatureInterval = setInterval(playLifeSounds, 2000); // Check for creature sounds every 2 seconds
    
    return () => {
      clearInterval(ambientInterval);
      clearInterval(creatureInterval);
      audioElements.noise.stop();
    };
  }, [audioElements, isPlaying, depth, temperature, oxygen, currentBiome, activeMarineLife]);
  
  // Handle play/pause
  const togglePlayback = () => {
    if (!isPlaying) {
      Tone.start().then(() => {
        // Create Tone.js objects only after Tone.start()
        const audioSystem = {
          ambientSynth: new Tone.PolySynth(Tone.Synth, {
            envelope: { attack: 0.5, decay: 1, sustain: 0.5, release: 3 }
          }).toDestination(),
          creatureSynths: {
            'low': new Tone.MonoSynth({
              oscillator: { type: 'sine' },
              envelope: { attack: 1, decay: 1, sustain: 0.7, release: 4 }
            }).toDestination(),
            'mid': new Tone.MonoSynth({
              oscillator: { type: 'triangle' },
              envelope: { attack: 0.5, decay: 0.5, sustain: 0.7, release: 3 }
            }).toDestination(),
            'high': new Tone.MonoSynth({
              oscillator: { type: 'sine4' },
              envelope: { attack: 0.2, decay: 0.3, sustain: 0.5, release: 2 }
            }).toDestination(),
            'low-mid': new Tone.DuoSynth({
              envelope: { attack: 0.5, decay: 0.5, sustain: 0.5, release: 2 }
            }).toDestination(),
            'mid-low': new Tone.FMSynth({
              envelope: { attack: 0.3, decay: 0.5, sustain: 0.5, release: 2 }
            }).toDestination(),
            'mid-high': new Tone.AMSynth({
              envelope: { attack: 0.2, decay: 0.3, sustain: 0.5, release: 1.5 }
            }).toDestination(),
            'high-mid': new Tone.PluckSynth().toDestination(),
            'predator': new Tone.MonoSynth({
              oscillator: { type: 'sawtooth' },
              envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.5 }
            }).toDestination()
          },
          effects: {
            reverb: new Tone.Reverb(5).toDestination(),
            delay: new Tone.FeedbackDelay(0.5, 0.4).toDestination(),
            filter: new Tone.Filter(500, "lowpass").toDestination()
          },
          noise: new Tone.Noise("brown").toDestination()
        };
        Object.values(audioSystem.creatureSynths).forEach(synth => {
          synth.connect(audioSystem.effects.reverb);
        });
        audioSystem.noise.connect(audioSystem.effects.filter);
        setAudioElements(audioSystem);
        setIsPlaying(true);
      });
    } else {
      // Dispose Tone.js objects on stop
      if (audioElements) {
        Object.values(audioElements.creatureSynths).forEach(synth => synth.dispose());
        Object.values(audioElements.effects).forEach(effect => effect.dispose());
        audioElements.noise.dispose();
        audioElements.ambientSynth.dispose();
        setAudioElements(null);
      }
      setIsPlaying(false);
    }
  };
  
  // Update biome based on coordinates and depth
  useEffect(() => {
    // Simplified biome determination based on depth
    let newBiome;
    
    // Check if we're near the fracture zones (north or south boundaries)
    const nearNorthFracture = Math.abs(coordinates.lat - CCZ_BOUNDS.north) < 1;
    const nearSouthFracture = Math.abs(coordinates.lat - CCZ_BOUNDS.south) < 1;
    
    if (nearNorthFracture || nearSouthFracture) {
      newBiome = 'fracture-zone';
    } 
    // Check for seamounts (simplified - in reality would use actual bathymetric data)
    else if (depth < 4000) {
      newBiome = 'seamount';
    }
    // Check for nodule fields (simplified - in reality would use actual distribution data)
    else if (depth >= 4200 && depth <= 5500 && Math.random() > 0.3) {
      newBiome = 'nodule-field';
    }
    // Default to abyssal plain
    else {
      newBiome = 'abyssal-plain';
    }
    
    setCurrentBiome(newBiome);
  }, [coordinates, depth]);
  
  // Helper function to format coordinates
  const formatCoordinate = (value, type) => {
    const absolute = Math.abs(value);
    const degrees = Math.floor(absolute);
    const minutes = Math.floor((absolute - degrees) * 60);
    const seconds = Math.floor(((absolute - degrees) * 60 - minutes) * 60);
    const direction = type === 'lat' 
      ? (value >= 0 ? 'N' : 'S') 
      : (value >= 0 ? 'E' : 'W');
    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };
  
  // Function to update parameters when exploring
  const exploreNewLocation = () => {
    // Generate random coordinates within the CCZ
    const newLat = CCZ_BOUNDS.south + Math.random() * (CCZ_BOUNDS.north - CCZ_BOUNDS.south);
    const newLng = CCZ_BOUNDS.west + Math.random() * (CCZ_BOUNDS.east - CCZ_BOUNDS.west);
    
    // Generate a depth appropriate for the CCZ
    const newDepth = 3500 + Math.random() * 2500; // Between 3500 and 6000 meters
    
    // Temperature varies slightly with depth
    const newTemp = 1.2 + (Math.random() * 0.6); // Between 1.2 and 1.8°C
    
    // Oxygen levels vary
    const newOxygen = 2 + (Math.random() * 3); // Between 2 and 5 ml/L
    
    setCoordinates({ lat: newLat, lng: newLng });
    setDepth(Math.round(newDepth));
    setTemperature(Math.round(newTemp * 10) / 10);
    setOxygen(Math.round(newOxygen * 10) / 10);
  };
  
  return (
    <div className="flex flex-col w-full h-full min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white p-6">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-blue-100">Deep Sea Sonic Explorer</h1>
        <h2 className="text-lg text-blue-300">Clarion-Clipperton Zone Soundscape Generator</h2>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
        {/* Left panel - Controls */}
        <div className="bg-blue-900/50 rounded-lg p-4 flex flex-col">
          <h3 className="text-xl font-semibold mb-4 text-center">Location Controls</h3>
          
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <MapPin className="mr-2 text-blue-300" size={20} />
              <span className="text-blue-300">Coordinates:</span>
            </div>
            <div className="pl-8 mb-1">
              <span className="text-blue-100">Latitude: {formatCoordinate(coordinates.lat, 'lat')}</span>
            </div>
            <div className="pl-8">
              <span className="text-blue-100">Longitude: {formatCoordinate(coordinates.lng, 'lng')}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Layers className="mr-2 text-blue-300" size={20} />
              <span className="text-blue-300">Depth:</span>
            </div>
            <div className="pl-8">
              <span className="text-blue-100">{depth} meters</span>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Compass className="mr-2 text-blue-300" size={20} />
              <span className="text-blue-300">Biome:</span>
            </div>
            <div className="pl-8">
              <span className="text-blue-100">{BIOMES.find(b => b.id === currentBiome)?.name || 'Unknown'}</span>
            </div>
          </div>
          
          <button 
            onClick={exploreNewLocation}
            className="mt-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Explore New Location
          </button>
        </div>
        
        {/* Center panel - Visualization and Playback */}
        <div className="bg-blue-900/50 rounded-lg p-4 flex flex-col">
          <div className="flex-grow relative mb-4">
            {/* This would be a WebGL visualization in a production app */}
            <div className="w-full h-64 bg-blue-950 rounded-lg relative overflow-hidden">
              {/* Simple representation of depth with gradient */}
              <div 
                className="absolute inset-0 bg-gradient-to-b from-blue-900 to-blue-950" 
                style={{ 
                  opacity: Math.max(0.1, Math.min(0.9, (depth - 3500) / 2500))
                }}
              />
              
              {/* Simplified nodule representation */}
              {currentBiome === 'nodule-field' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-4 gap-4 p-4">
                    {Array(16).fill(0).map((_, i) => (
                      <div 
                        key={i} 
                        className="bg-gray-700 rounded-full w-4 h-4 transform rotate-45" 
                        style={{ opacity: 0.3 + Math.random() * 0.7 }}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Simplified sea life representation */}
              {activeMarineLife.slice(0, 5).map((creature, i) => (
                <div 
                  key={creature.id}
                  className="absolute w-3 h-3 bg-gray-300 rounded-full animate-pulse"
                  style={{ 
                    left: `${20 + (i * 15)}%`, 
                    top: `${30 + (Math.random() * 40)}%`,
                    opacity: 0.6 + Math.random() * 0.4,
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
              
              {/* Text overlay with coordinates and depth */}
              <div className="absolute bottom-2 left-2 text-xs text-blue-300">
                {formatCoordinate(coordinates.lat, 'lat')}, {formatCoordinate(coordinates.lng, 'lng')} | {depth}m
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mb-4">
            <button 
              onClick={togglePlayback}
              className={`flex items-center justify-center w-16 h-16 rounded-full ${
                isPlaying 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              } text-white transition-colors`}
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-800/50 p-3 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Thermometer className="mr-1 text-blue-300" size={16} />
                <span className="text-blue-300 text-sm">Temp</span>
              </div>
              <div className="text-center text-blue-100 font-semibold">
                {temperature}°C
              </div>
            </div>
            
            <div className="bg-blue-800/50 p-3 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Droplets className="mr-1 text-blue-300" size={16} />
                <span className="text-blue-300 text-sm">O2</span>
              </div>
              <div className="text-center text-blue-100 font-semibold">
                {oxygen} ml/L
              </div>
            </div>
            
            <div className="bg-blue-800/50 p-3 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Clock className="mr-1 text-blue-300" size={16} />
                <span className="text-blue-300 text-sm">Time</span>
              </div>
              <div className="text-center text-blue-100 font-semibold">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right panel - Marine Life */}
        <div className="bg-blue-900/50 rounded-lg p-4 flex flex-col">
          <h3 className="text-xl font-semibold mb-4 text-center">Marine Life Detected</h3>
          
          {activeMarineLife.length > 0 ? (
            <div className="flex-grow overflow-y-auto">
              {activeMarineLife.map(creature => (
                <div key={creature.id} className="mb-3 p-2 bg-blue-800/30 rounded-lg flex items-start">
                  <Fish className="mr-2 text-blue-300 flex-shrink-0 mt-1" size={18} />
                  <div>
                    <h4 className="font-medium text-blue-200">{creature.name}</h4>
                    <p className="text-xs text-blue-400">
                      Depth range: {creature.depth[0]}-{creature.depth[1]}m
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center text-blue-400 italic">
              No marine life detected at current location...
            </div>
          )}
          
          <div className="mt-4 text-sm text-blue-300">
            <p className="mb-2">
              Marine life presence affects the soundscape's melodic patterns and timbral qualities.
            </p>
            <p>
              Each creature has its own sonic signature reflected in the generated music.
            </p>
          </div>
        </div>
      </div>
      
      <footer className="mt-8 text-center text-blue-400 text-sm">
        <p>
          Data based on research from the Clarion-Clipperton Zone, Pacific Ocean (Depth: 4,000-5,500m)
        </p>
        <p className="mt-1">
          Sound generation uses real-time data mapping of depth, temperature, oxygen levels, and marine biodiversity
          {' | '}
          <a href="https://github.com/danielraffel/deep-sea-sonic-explorer/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-200">GitHub</a>
        </p>
      </footer>
    </div>
  );
};

export default DeepSeaSonicExplorer;
