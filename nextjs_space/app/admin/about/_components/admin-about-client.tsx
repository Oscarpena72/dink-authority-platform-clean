"use client";
import React, { useEffect, useState } from 'react';
import { Save, Eye } from 'lucide-react';

export default function AdminAboutClient() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  /* Fields that map to /about page sections */
  const [heroTitle, setHeroTitle] = useState('About Dink Authority');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [missionTitle, setMissionTitle] = useState('Our Mission');
  const [missionP1, setMissionP1] = useState('');
  const [missionP2, setMissionP2] = useState('');
  const [missionP3, setMissionP3] = useState('');
  const [valuesTitle, setValuesTitle] = useState('What Drives Us');
  const [value1Title, setValue1Title] = useState('Precision Coverage');
  const [value1Desc, setValue1Desc] = useState('');
  const [value2Title, setValue2Title] = useState('Community First');
  const [value2Desc, setValue2Desc] = useState('');
  const [value3Title, setValue3Title] = useState('Global Reach');
  const [value3Desc, setValue3Desc] = useState('');
  const [value4Title, setValue4Title] = useState('Editorial Excellence');
  const [value4Desc, setValue4Desc] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then((s: Record<string, string>) => {
        if (s.about_hero_title) setHeroTitle(s.about_hero_title);
        if (s.about_hero_subtitle) setHeroSubtitle(s.about_hero_subtitle);
        if (s.about_mission_title) setMissionTitle(s.about_mission_title);
        if (s.about_mission_p1) setMissionP1(s.about_mission_p1);
        if (s.about_mission_p2) setMissionP2(s.about_mission_p2);
        if (s.about_mission_p3) setMissionP3(s.about_mission_p3);
        if (s.about_values_title) setValuesTitle(s.about_values_title);
        if (s.about_value1_title) setValue1Title(s.about_value1_title);
        if (s.about_value1_desc) setValue1Desc(s.about_value1_desc);
        if (s.about_value2_title) setValue2Title(s.about_value2_title);
        if (s.about_value2_desc) setValue2Desc(s.about_value2_desc);
        if (s.about_value3_title) setValue3Title(s.about_value3_title);
        if (s.about_value3_desc) setValue3Desc(s.about_value3_desc);
        if (s.about_value4_title) setValue4Title(s.about_value4_title);
        if (s.about_value4_desc) setValue4Desc(s.about_value4_desc);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setSuccess('');
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          about_hero_title: heroTitle,
          about_hero_subtitle: heroSubtitle,
          about_mission_title: missionTitle,
          about_mission_p1: missionP1,
          about_mission_p2: missionP2,
          about_mission_p3: missionP3,
          about_values_title: valuesTitle,
          about_value1_title: value1Title,
          about_value1_desc: value1Desc,
          about_value2_title: value2Title,
          about_value2_desc: value2Desc,
          about_value3_title: value3Title,
          about_value3_desc: value3Desc,
          about_value4_title: value4Title,
          about_value4_desc: value4Desc,
        }),
      });
      setSuccess('About page saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      alert('Save failed');
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">About Page</h1>
          <p className="text-sm text-gray-500 mt-1">Edit the content of the public /about page</p>
        </div>
        <a href="/about" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium">
          <Eye size={16} /> Preview Page
        </a>
      </div>

      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>}

      {/* Hero Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="font-semibold text-lg mb-1 text-brand-purple">Hero Section</h2>
        <p className="text-sm text-gray-500 mb-4">The purple banner at the top of the page.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" value={heroTitle} onChange={e => setHeroTitle(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple" placeholder="About Dink Authority" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <input type="text" value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple" placeholder="The premier digital magazine..." />
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="font-semibold text-lg mb-1 text-brand-purple">Mission Section</h2>
        <p className="text-sm text-gray-500 mb-4">The main text body of the page. Up to 3 paragraphs.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
            <input type="text" value={missionTitle} onChange={e => setMissionTitle(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple" placeholder="Our Mission" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 1</label>
            <textarea value={missionP1} onChange={e => setMissionP1(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple" placeholder="First paragraph..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 2 <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea value={missionP2} onChange={e => setMissionP2(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple" placeholder="Second paragraph..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 3 <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea value={missionP3} onChange={e => setMissionP3(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple" placeholder="Third paragraph..." />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="font-semibold text-lg mb-1 text-brand-purple">Values / Cards Section</h2>
        <p className="text-sm text-gray-500 mb-4">The 4 cards at the bottom of the page ("What Drives Us").</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
            <input type="text" value={valuesTitle} onChange={e => setValuesTitle(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple" placeholder="What Drives Us" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Card 1', title: value1Title, desc: value1Desc, setTitle: setValue1Title, setDesc: setValue1Desc },
              { label: 'Card 2', title: value2Title, desc: value2Desc, setTitle: setValue2Title, setDesc: setValue2Desc },
              { label: 'Card 3', title: value3Title, desc: value3Desc, setTitle: setValue3Title, setDesc: setValue3Desc },
              { label: 'Card 4', title: value4Title, desc: value4Desc, setTitle: setValue4Title, setDesc: setValue4Desc },
            ].map((card) => (
              <div key={card.label} className="border border-gray-100 rounded-lg p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase">{card.label}</p>
                <input type="text" value={card.title} onChange={e => card.setTitle(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple" placeholder="Title" />
                <textarea value={card.desc} onChange={e => card.setDesc(e.target.value)} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple" placeholder="Description" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="sticky bottom-4 bg-white border border-gray-200 rounded-xl p-4 shadow-lg flex items-center justify-end gap-3">
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-brand-purple text-white px-6 py-2.5 rounded-lg hover:bg-brand-purple-light text-sm font-medium disabled:opacity-50">
          <Save size={16} /> {saving ? 'Saving...' : 'Save About Page'}
        </button>
      </div>
    </div>
  );
}
