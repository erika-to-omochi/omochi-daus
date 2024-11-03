'use client'

import { useState, useEffect, useRef } from "react"
import { Home, Image as ImageIcon, Shapes, Palette, Text as TextIcon, Undo2, Ban, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import Button from "./ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Stage, Layer, Image as KonvaImage, Text as KonvaText, Rect as KonvaRect, Transformer } from 'react-konva';
import useImage from 'use-image';
import { v4 as uuidv4 } from 'uuid';

// カラーピッカーコンポーネント
const ColorPicker = ({ label, color, onChange, onReset }) => (
  <div className="flex flex-col items-start gap-2 mb-4">
    <div className="flex items-center gap-2">
      <span>{label}:</span>
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 p-0 border-none"
      />
    </div>
    <button
      type="button"
      onClick={onReset}
      className="mt-2 text-sm text-purple-600 underline"
    >
      リセット
    </button>
  </div>
);

// テキスト入力フォームコンポーネント
const TextInputForm = ({ onSubmit }) => {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(20);
  const [color, setColor] = useState("#000000");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === "") return;
    onSubmit({ text, fontSize, color });
    setText("");
    setFontSize(20);
    setColor("#000000");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col">
        テキスト:
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded"
          required
        />
      </label>
      <label className="flex flex-col">
        フォントサイズ:
        <input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="mt-1 p-2 border border-gray-300 rounded"
          min="5"
          required
        />
      </label>
      <label className="flex flex-col">
        色:
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded"
          required
        />
      </label>
      <button type="submit" className="bg-purple-600 text-white p-2 rounded">
        キャンバスに追加
      </button>
    </form>
  );
};

// 定義済みのタブ項目
const initialTabs = [
  {
    id: "photos",
    label: "おもち",
    icon: <ImageIcon className="w-4 h-4" />,
    items: [
      "/omochi/1.png",
      "/omochi/2.png",
      "/omochi/3.png",
      "/omochi/4.png",
      "/omochi/5.png",
      "/omochi/6.png",
    ]
  },
  {
    id: "objects",
    label: "その他",
    icon: <Shapes className="w-4 h-4" />,
    items: [
      "/object/1.png",
      "/object/2.png",
      "/object/3.png",
      "/object/4.png",
      "/object/5.png",
      "/object/6.png",
      "/object/7.png",
      "/object/8.png",
      "/object/9.png",
    ]
  },
  {
    id: "backgrounds",
    label: "背景",
    icon: <Palette className="w-4 h-4" />,
    items: [] // 画像項目を削除
  },
  // 新しいテキスト入力タブ
  {
    id: "text",
    label: "テキスト",
    icon: <TextIcon className="w-4 h-4" />,
    items: [] // このタブには画像がないため空配列
  }
];

// カスタムImageコンポーネント
const DraggableImage = ({ element, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const [image] = useImage(element.src);

  useEffect(() => {
    if (isSelected && shapeRef.current) {
      // Transformer を適用
    }
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        image={image}
        x={element.x}
        y={element.y}
        draggable
        ref={shapeRef}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            ...element,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...element,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
          });
        }}
        rotation={element.rotation}
        width={element.width}
        height={element.height}
      />
      {isSelected && (
        <Transformer
          anchorSize={8}
          borderDash={[6, 2]}
          rotateAnchorOffset={20}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
          ref={(tr) => {
            if (tr) {
              tr.nodes([shapeRef.current]);
              tr.getLayer().batchDraw();
            }
          }}
        />
      )}
    </>
  );
};

// カスタムTextコンポーネント
const DraggableText = ({ element, isSelected, onSelect, onChange, onEdit }) => {
  const shapeRef = useRef();

  useEffect(() => {
    if (isSelected && shapeRef.current) {
      // Transformer を適用
    }
  }, [isSelected]);

  const handleDblClick = () => {
    onEdit(element.id, { x: element.x, y: element.y, text: element.text });
  };

  return (
    <>
      <KonvaText
        text={element.text}
        x={element.x}
        y={element.y}
        fontSize={element.fontSize}
        fill={element.fill}
        fontFamily={element.fontFamily}
        draggable
        ref={shapeRef}
        onClick={onSelect}
        onTap={onSelect}
        onDblClick={handleDblClick}
        onDragEnd={(e) => {
          onChange({
            ...element,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...element,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            fontSize: Math.max(5, node.fontSize() * scaleX),
          });
        }}
        rotation={element.rotation}
      />
      {isSelected && (
        <Transformer
          anchorSize={8}
          borderDash={[6, 2]}
          rotateAnchorOffset={20}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
          ref={(tr) => {
            if (tr) {
              tr.nodes([shapeRef.current]);
              tr.getLayer().batchDraw();
            }
          }}
        />
      )}
    </>
  );
};

export default function Component() {
  const [selectedTab, setSelectedTab] = useState(initialTabs[0]);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [isClient, setIsClient] = useState(false);
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editingElement, setEditingElement] = useState(null); // 編集中の要素
  const [backgroundColor, setBackgroundColor] = useState("#ffffff"); // 背景色の状態
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1; // 必要に応じて変更
  const textareaRef = useRef();
  const stageRef = useRef();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // ウィンドウサイズに応じてキャンバスサイズを調整（レスポンシブ対応）
  useEffect(() => {
    const updateStageSize = () => {
      const width = window.innerWidth * 0.8; // 画面幅の80%
      const height = window.innerHeight * 0.6; // 画面高さの60%
      setStageSize({ width, height });
    };

    updateStageSize();
    window.addEventListener('resize', updateStageSize);

    return () => {
      window.removeEventListener('resize', updateStageSize);
    };
  }, []);

  const getImageDimensions = (src) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = reject;
    });
  };

  // 履歴に現在の状態を追加
  const addHistory = (newElements) => {
    const updatedHistory = history.slice(0, historyStep);
    setHistory([...updatedHistory, elements]);
    setHistoryStep(historyStep + 1);
    setElements(newElements);
  };

  const handleAddImage = async (src) => {
    try {
      const { width, height } = await getImageDimensions(src);
      const maxWidth = stageSize.width;
      const maxHeight = stageSize.height;
      let displayWidth = width;
      let displayHeight = height;

      const scale = Math.min(maxWidth / width, maxHeight / height, 1);
      displayWidth = width * scale;
      displayHeight = height * scale;

      const newImage = {
        id: uuidv4(),
        type: 'image',
        src,
        x: 50,
        y: 50,
        rotation: 0,
        width: displayWidth,
        height: displayHeight
      };

      addHistory([...elements, newImage]);
    } catch (error) {
      console.error("画像の読み込みに失敗しました:", error);
    }
  };

  const handleAddCustomText = ({ text, fontSize, color }) => {
    const newText = {
      id: uuidv4(),
      type: 'text',
      text,
      x: 100, // デフォルト位置
      y: 100, // デフォルト位置
      rotation: 0,
      fontSize,
      fill: color,
      fontFamily: "Arial, sans-serif" // フォントファミリーをデフォルト設定
    };

    addHistory([...elements, newText]);
    setSelectedTab(initialTabs[0]); // テキスト入力後に他のタブに戻す場合
  };

  const handleChangeElement = (id, newAttrs) => {
    const updatedElements = elements.map((el) => {
      if (el.id === id) {
        return { ...el, ...newAttrs };
      }
      return el;
    });
    addHistory(updatedElements);
  };

  const handleStageMouseDown = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
      return;
    }
    // クリックした要素を選択
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    } else {
      const clickedElement = e.target.attrs.id;
      if (clickedElement) {
        setSelectedId(clickedElement);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (selectedId !== null) {
          e.preventDefault();
          addHistory(elements.filter((el) => el.id !== selectedId));
          setSelectedId(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedId, elements, history, historyStep]);

  useEffect(() => {
    if (editingElement && textareaRef.current) {
      const { id } = editingElement;
      const textElement = elements.find(el => el.id === id);
      if (textElement) {
        const stage = stageRef.current;
        const stageBox = stage.container().getBoundingClientRect();
        const { x, y, fontSize, fill } = textElement;
        const scale = stage.scaleX();
        const adjustedFontSize = fontSize * scale;
        const absolutePosition = {
          x: stageBox.left + x * scale,
          y: stageBox.top + y * scale
        };

        textareaRef.current.style.position = 'absolute';
        textareaRef.current.style.top = `${absolutePosition.y}px`;
        textareaRef.current.style.left = `${absolutePosition.x}px`;
        textareaRef.current.style.width = `${textElement.width || 200}px`; // 幅を指定
        textareaRef.current.style.height = `${textElement.fontSize * 1.2}px`;
        textareaRef.current.style.fontSize = `${adjustedFontSize}px`;
        textareaRef.current.style.color = fill;
        textareaRef.current.style.background = 'transparent';
        textareaRef.current.style.border = 'none';
        textareaRef.current.style.outline = 'none';
        textareaRef.current.style.resize = 'none';
        textareaRef.current.style.fontFamily = textElement.fontFamily || 'Arial, sans-serif';
        textareaRef.current.style.lineHeight = '1.2';
        textareaRef.current.style.pointerEvents = 'auto';

        textareaRef.current.value = textElement.text;
        textareaRef.current.focus();
      }
    }
  }, [editingElement, elements]);

  const handleTextChange = (e) => {
    const updatedText = e.target.value;
    if (editingElement) {
      handleChangeElement(editingElement.id, { text: updatedText });
    }
  };

  const handleTextBlur = () => {
    setEditingElement(null);
  };

  // Undoハンドラー
  const handleUndo = () => {
    if (historyStep === 0) return;
    const previousElements = history[historyStep - 1];
    setHistoryStep(historyStep - 1);
    setElements(previousElements);
  };

  // Add Elementハンドラー
  const handleAddElement = () => {
    const newText = {
      id: uuidv4(),
      type: 'text',
      text: '新しいテキスト',
      x: 150,
      y: 150,
      rotation: 0,
      fontSize: 20,
      fill: '#000000',
      fontFamily: "Arial, sans-serif"
    };

    addHistory([...elements, newText]);
  };

  // Background Changeハンドラー
  const handleBackgroundChange = () => {
    const backgroundTab = initialTabs.find(tab => tab.id === "backgrounds");
    if (backgroundTab) {
      setSelectedTab(backgroundTab);
    }
  };

  // 背景色リセットハンドラー
  const resetBackgroundColor = () => {
    setBackgroundColor("#ffffff"); // デフォルトの色にリセット
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 relative">
      <header className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-purple-900">
            <Home className="w-6 h-6" />
          </Button>
          <span className="text-lg text-purple-900">絵本を作る</span>
        </div>

        <nav>
          <ul className="flex gap-2">
            {initialTabs.map((tab) => (
              <li key={tab.id}>
                <Button
                  variant="secondary"
                  className={`rounded-full bg-white hover:bg-white/90 text-purple-900 px-4 py-2 relative ${
                    tab === selectedTab ? "font-semibold" : ""
                  }`}
                  onClick={() => setSelectedTab(tab)}
                >
                  <span className="flex items-center gap-2">
                    {tab.icon}
                    {tab.label}
                  </span>
                  {tab === selectedTab && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                      layoutId="underline"
                    />
                  )}
                </Button>
              </li>
            ))}
            {/* 不要なテキスト追加ボタンを削除または残す */}
          </ul>
        </nav>
      </header>

      <div className="flex h-[calc(100vh-8rem)]">
        <main className="flex-grow flex justify-center items-center p-4">
          <div className="w-full max-w-4xl aspect-[4/3] bg-white rounded-lg shadow-sm overflow-hidden relative">
            {isClient && (
              <Stage
                width={stageSize.width}
                height={stageSize.height}
                onMouseDown={handleStageMouseDown}
                onTouchStart={handleStageMouseDown}
                ref={stageRef}
              >
                <Layer>
                  {/* 背景色を適用するための矩形 */}
                  <KonvaRect
                    x={0}
                    y={0}
                    width={stageSize.width}
                    height={stageSize.height}
                    fill={backgroundColor}
                    listening={false} // 背景をドラッグできないようにする
                  />
                  {elements.map((element) => {
                    if (element.type === 'image') {
                      return (
                        <DraggableImage
                          key={element.id}
                          element={element}
                          isSelected={selectedId === element.id}
                          onSelect={() => setSelectedId(element.id)}
                          onChange={(newAttrs) => handleChangeElement(element.id, newAttrs)}
                        />
                      );
                    } else if (element.type === 'text') {
                      return (
                        <DraggableText
                          key={element.id}
                          element={element}
                          isSelected={selectedId === element.id}
                          onSelect={() => setSelectedId(element.id)}
                          onChange={(newAttrs) => handleChangeElement(element.id, newAttrs)}
                          onEdit={(id, attrs) => setEditingElement({ id, ...attrs })}
                        />
                      );
                    }
                    return null;
                  })}
                </Layer>
              </Stage>
            )}
            {editingElement && (
              <textarea
                ref={textareaRef}
                value={elements.find(el => el.id === editingElement.id)?.text || ''}
                onChange={handleTextChange}
                onBlur={handleTextBlur}
                style={{
                  position: 'absolute',
                  top: `${editingElement.y}px`,
                  left: `${editingElement.x}px`,
                  fontSize: `${elements.find(el => el.id === editingElement.id)?.fontSize}px`,
                  color: elements.find(el => el.id === editingElement.id)?.fill,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  pointerEvents: 'auto',
                  fontFamily: elements.find(el => el.id === editingElement.id)?.fontFamily || 'Arial, sans-serif',
                  lineHeight: '1.2',
                }}
              />
            )}
          </div>
        </main>

        <aside className="w-64 p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-lg p-4 shadow-sm"
            >
              {selectedTab.id !== "text" ? (
                <>
                  <h2 className="font-semibold mb-4 text-purple-900">{selectedTab.label}</h2>
                  {selectedTab.id === "backgrounds" ? (
                    <ColorPicker
                      label="背景色"
                      color={backgroundColor}
                      onChange={setBackgroundColor}
                      onReset={resetBackgroundColor}
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {selectedTab.items.map((item, index) => (
                        <button
                          key={index}
                          className="aspect-square rounded border-2 border-purple-100 hover:border-purple-300 transition-colors"
                          onClick={() => handleAddImage(item)}
                        >
                          <img
                            src={item}
                            alt={`${selectedTab.label} ${index + 1}`}
                            className="w-full h-full object-cover rounded"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <TextInputForm onSubmit={handleAddCustomText} />
              )}
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>

      {/* Bottom Controls */}
      <footer className="flex justify-center">
        <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 shadow-sm">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-purple-900" onClick={handleUndo}>
              <Undo2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-purple-900" onClick={() => {
              if (selectedId) {
                addHistory(elements.filter(el => el.id !== selectedId));
                setSelectedId(null);
              }
            }}>
              <Ban className="w-5 h-5" />
            </Button>
          </div>

          <div className="h-6 w-px bg-purple-200" />

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-purple-900" onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-purple-900 min-w-[3ch] text-center">
              {currentPage}/{totalPages}
            </span>
            <Button variant="ghost" size="icon" className="text-purple-900" onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="h-6 w-px bg-purple-200" />

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-purple-900" onClick={handleAddElement}>
              <Plus className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-purple-900" onClick={handleBackgroundChange}>
              <Palette className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
