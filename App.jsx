import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Shuffle,
  RotateCcw,
  Sparkles,
  Volume2,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

// DỮ LIỆU TỪ FILE flashcards.csv (đã chuyển thành mảng)
const FLASHCARDS = [
  {
    front:
      "Ai là nhà sáng chế nổi tiếng được nhắc đến với phát minh bóng đèn điện?",
    back: "Tô-mát Ê-đi-xơn (Thomas Edison).",
    icon: "💡",
  },
  {
    front: "Nhà sáng chế Các Ben (Karl Benz), người tạo ra chiếc ô tô, sinh năm nào?",
    back: "Năm 1844.",
    icon: "🚗",
  },
  {
    front: "Các Ben (Karl Benz) là một kỹ sư cơ khí người nước nào?",
    back: "Người Đức.",
    icon: "🇩🇪",
  },
  {
    front:
      "Năm 1870, Các Ben (Karl Benz) đã thiết kế loại động cơ nào, một bộ phận quan trọng cho ô tô sau này?",
    back: "Động cơ chạy bằng xăng.",
    icon: "⚙️",
  },
  {
    front:
      "Chiếc ô tô của Các Ben (Karl Benz) được hoàn thiện và cấp bằng sáng chế vào năm nào?",
    back: "Năm 1886.",
    icon: "📜",
  },
  {
    front:
      "Phát minh ô tô đã giúp cho việc di chuyển của con người trở nên _____ hơn.",
    back: "thuận tiện",
    icon: "🛣️",
  },
  {
    front: "Ai là nhà sáng chế ra động cơ hơi nước vào năm 1784?",
    back: "Giêm Oát (James Watt).",
    icon: "♨️",
  },
  {
    front:
      "Vào năm 1876, A-lếch-xan-đơ Gra-ham Beo (Alexander Graham Bell) đã phát minh ra thiết bị gì?",
    back: "Điện thoại.",
    icon: "☎️",
  },
  {
    front:
      "Tô-mát Ê-đi-xơn (Thomas Edison) đã phát minh ra bóng đèn sợi đốt vào năm nào?",
    back: "Năm 1879.",
    icon: "🕯️",
  },
  {
    front:
      "Đức tính nào của nhà sáng chế thể hiện sự bền bỉ, không từ bỏ khi gặp khó khăn?",
    back: "Kiên trì.",
    icon: "💪",
  },
  {
    front:
      "Để trở thành nhà sáng chế, cần có _____ để nghĩ ra những ý tưởng mới mẻ và độc đáo.",
    back: "Sáng tạo",
    icon: "🎨",
  },
  {
    front:
      "Đức tính nào của nhà sáng chế thể hiện sự say mê, yêu thích công việc nghiên cứu của mình?",
    back: "Đam mê.",
    icon: "🔥",
  },
  {
    front:
      "Một nhà sáng chế cần có đức tính _____ để không nản lòng trước những lần thử nghiệm thất bại.",
    back: "Không ngại thất bại.",
    icon: "🧪",
  },
  {
    front:
      "Đức tính nào thể hiện sự ham muốn tìm hiểu, khám phá các hiện tượng khoa học?",
    back: "Tò mò khoa học.",
    icon: "🔎",
  },
  {
    front:
      "_____ là sức mạnh tinh thần giúp nhà sáng chế vượt qua mọi khó khăn, thử thách.",
    back: "Nghị lực",
    icon: "🛡️",
  },
  {
    front:
      "Để phát hiện ra những điều mới lạ từ thế giới xung quanh, nhà sáng chế cần có đức tính _____.",
    back: "Chịu khó quan sát",
    icon: "👀",
  },
  {
    front:
      "Một nhà sáng chế giỏi luôn có tinh thần _____ để liên tục tiếp thu kiến thức mới.",
    back: "Ham học hỏi",
    icon: "📚",
  },
  {
    front:
      "Đức tính nào được liệt kê trong bài học mà một nhà sáng chế KHÔNG nên có?",
    back: "Nóng vội.",
    icon: "⏱️",
  },
  {
    front: "Máy tính điện tử đầu tiên có tên là gì?",
    back: "ENIAC.",
    icon: "🖥️",
  },
];

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function speak(text, rate = 0.95) {
  try {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "vi-VN";
    u.rate = rate;
    synth.speak(u);
  } catch {
    // im lặng nếu trình duyệt không hỗ trợ
  }
}

function SoftButton({ onClick, children, className = "", title }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={
        "rounded-2xl px-4 py-2 text-sm font-semibold shadow-sm active:scale-[0.98] transition " +
        "bg-white/80 hover:bg-white border border-white/70 " +
        className
      }
    >
      {children}
    </button>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="w-full h-3 rounded-full bg-white/60 overflow-hidden border border-white/70">
      <motion.div
        className="h-full rounded-full bg-black/10"
        initial={{ width: 0 }}
        animate={{ width: `${clamp(Math.round(value * 100), 0, 100)}%` }}
        transition={{ type: "spring", stiffness: 160, damping: 22 }}
      />
    </div>
  );
}

function Sticker({ children }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-2xl bg-white/70 border border-white/80 px-3 py-1 shadow-sm">
      {children}
    </div>
  );
}

function CardFace({ text, isFront }) {
  return (
    <div className="h-full w-full flex items-center justify-center p-6">
      <div className="max-w-[42ch] text-center">
        <div className="text-xs font-bold tracking-wide uppercase opacity-70">
          {isFront ? "Câu hỏi" : "Đáp án"}
        </div>
        <div className="mt-3 text-lg sm:text-xl font-extrabold leading-snug">
          {text}
        </div>
        <div className="mt-4 text-xs opacity-70">Nhấn vào thẻ để lật ✨</div>
      </div>
    </div>
  );
}

function CuteCard({ front, back, icon, flipped, onFlip }) {
  return (
    <button
      onClick={onFlip}
      className="relative w-full max-w-[720px] aspect-[4/3] rounded-[28px] outline-none"
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="absolute inset-0 rounded-[28px]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 rounded-[28px] shadow-xl border border-white/70"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="absolute inset-0 rounded-[28px] bg-white/70" />
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/60 via-white/40 to-white/10" />
          <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-white/60 blur-xl" />
          <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-white/60 blur-xl" />

          <div className="absolute top-4 left-4">
            <Sticker>
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-bold">Flashcard</span>
            </Sticker>
          </div>

          <div className="absolute top-4 right-4">
            <Sticker>
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold">Học vui</span>
            </Sticker>
          </div>

          <CardFace text={front} isFront />
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-[28px] shadow-xl border border-white/70"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="absolute inset-0 rounded-[28px] bg-white/75" />
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/50 via-white/40 to-white/10" />

          <div className="absolute top-4 left-4">
            <Sticker>
              <span className="text-2xl">✅</span>
              <span className="text-xs font-bold">Đáp án</span>
            </Sticker>
          </div>

          <div className="absolute top-4 right-4">
            <Sticker>
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-bold">Tuyệt!</span>
            </Sticker>
          </div>

          <CardFace text={back} />
        </div>
      </motion.div>
    </button>
  );
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [order, setOrder] = useState(() => FLASHCARDS.map((_, i) => i));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState(() => new Set());

  const total = order.length;
  const current = FLASHCARDS[order[idx]];

  const progress = useMemo(() => {
    const done = seen.size;
    return total ? done / total : 0;
  }, [seen, total]);

  const canPrev = idx > 0;
  const canNext = idx < total - 1;

  const go = (nextIdx) => {
    setIdx(clamp(nextIdx, 0, total - 1));
    setFlipped(false);
  };

  const markSeen = (i) => {
    setSeen((prev) => {
      const s = new Set(prev);
      s.add(i);
      return s;
    });
  };

  const onFlip = () => {
    setFlipped((v) => {
      const nv = !v;
      if (nv) markSeen(order[idx]);
      return nv;
    });
  };

  const onShuffle = () => {
    const arr = [...order];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setOrder(arr);
    setIdx(0);
    setFlipped(false);
    setSeen(new Set());
  };

  const onReset = () => {
    setIdx(0);
    setFlipped(false);
    setSeen(new Set());
  };

  const readFront = () => speak(current.front);
  const readBack = () => speak(current.back);

  useEffect(() => {
    const onKey = (e) => {
      if (!started) return;
      if (e.key === "ArrowLeft") go(idx - 1);
      if (e.key === "ArrowRight") go(idx + 1);
      if (e.key === " ") {
        e.preventDefault();
        onFlip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, started]);

  const finished = started && seen.size === total;

  return (
    <div className="min-h-screen w-full">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-pink-100 to-sky-100" />
        <div className="absolute inset-0 opacity-60">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/70 blur-2xl" />
          <div className="absolute top-56 right-16 w-56 h-56 rounded-full bg-white/60 blur-3xl" />
          <div className="absolute bottom-10 left-1/3 w-72 h-72 rounded-full bg-white/50 blur-3xl" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.20]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12px 12px, rgba(0,0,0,0.22) 2px, transparent 3px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/80 shadow-sm flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Flashcards Nhà Sáng Chế
              </div>
              <div className="text-sm opacity-80 font-medium">
                Dành cho học sinh tiểu học • Nhấn <b>Space</b> để lật, <b>←/→</b>{" "}
                để chuyển
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SoftButton
              title="Trộn thẻ"
              onClick={onShuffle}
              className="flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4" /> Trộn
            </SoftButton>
            <SoftButton
              title="Làm lại"
              onClick={onReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Làm lại
            </SoftButton>
          </div>
        </header>

        <div className="mt-6 rounded-3xl bg-white/40 border border-white/70 shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sticker>
                <span className="text-lg">🧠</span>
                <span className="text-sm font-bold">Tiến độ</span>
              </Sticker>
              <div className="text-sm font-semibold">
                {seen.size}/{total} thẻ đã lật
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sticker>
                <span className="text-lg">🧾</span>
                <span className="text-sm font-bold">Thẻ</span>
              </Sticker>
              <div className="text-sm font-semibold">
                {idx + 1}/{total}
              </div>
            </div>
          </div>

          <div className="mt-3">
            <ProgressBar value={progress} />
          </div>
        </div>

        <main className="mt-6">
          {!started ? (
            <div className="rounded-3xl bg-white/55 border border-white/70 shadow-sm p-6 sm:p-10">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <motion.div
                  initial={{ rotate: -2, scale: 0.98, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 160, damping: 16 }}
                  className="w-full md:w-[360px]"
                >
                  <div className="rounded-[32px] bg-white/75 border border-white/80 shadow-xl p-6">
                    <div className="text-6xl">🧑‍🔬✨</div>
                    <div className="mt-3 text-xl font-extrabold">
                      Sẵn sàng học chưa?
                    </div>
                    <div className="mt-2 text-sm opacity-80 font-medium">
                      Lật thẻ để xem đáp án, học vui mà nhớ lâu!
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Sticker>
                        <span>💡</span>
                        <span className="text-xs font-bold">Phát minh</span>
                      </Sticker>
                      <Sticker>
                        <span>🚗</span>
                        <span className="text-xs font-bold">Ô tô</span>
                      </Sticker>
                      <Sticker>
                        <span>☎️</span>
                        <span className="text-xs font-bold">Điện thoại</span>
                      </Sticker>
                      <Sticker>
                        <span>📚</span>
                        <span className="text-xs font-bold">Đức tính</span>
                      </Sticker>
                    </div>
                  </div>
                </motion.div>

                <div className="flex-1">
                  <div className="text-2xl sm:text-3xl font-extrabold">
                    Trò chơi Flashcards
                  </div>
                  <div className="mt-2 text-sm sm:text-base opacity-85 font-medium leading-relaxed">
                    • Nhấn <b>Bắt đầu</b> để vào học.<br />
                    • Nhấn <b>Space</b> để lật thẻ.<br />
                    • Dùng <b>← / →</b> để chuyển thẻ.<br />
                    • Có nút <b>Trộn</b> để luyện lại theo thứ tự ngẫu nhiên.
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => setStarted(true)}
                      className="rounded-2xl px-5 py-3 text-sm sm:text-base font-extrabold shadow-lg border border-white/70 bg-white hover:bg-white/90 active:scale-[0.98] transition"
                    >
                      🚀 Bắt đầu
                    </button>
                  </div>

                  <div className="mt-4 text-xs opacity-75">
                    Gợi ý: nếu máy không đọc tiếng Việt, em vẫn có thể bấm nút 🔊
                    để nghe lại.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={order[idx] + "-" + flipped}
                  initial={{ y: 10, opacity: 0, scale: 0.98 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -10, opacity: 0, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 160, damping: 18 }}
                  className="w-full flex justify-center"
                >
                  <CuteCard
                    front={current.front}
                    back={current.back}
                    icon={current.icon}
                    flipped={flipped}
                    onFlip={onFlip}
                  />
                </motion.div>
              </AnimatePresence>

              <div className="w-full max-w-[720px] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <SoftButton
                    title="Thẻ trước"
                    onClick={() => go(idx - 1)}
                    className={
                      "flex items-center gap-2 " +
                      (canPrev ? "" : "opacity-50 pointer-events-none")
                    }
                  >
                    <ArrowLeft className="w-4 h-4" /> Trước
                  </SoftButton>
                  <SoftButton
                    title="Thẻ sau"
                    onClick={() => go(idx + 1)}
                    className={
                      "flex items-center gap-2 " +
                      (canNext ? "" : "opacity-50 pointer-events-none")
                    }
                  >
                    Sau <ArrowRight className="w-4 h-4" />
                  </SoftButton>
                </div>

                <div className="flex items-center gap-2">
                  <SoftButton
                    title="Đọc câu hỏi"
                    onClick={readFront}
                    className="flex items-center gap-2"
                  >
                    <Volume2 className="w-4 h-4" /> Đọc câu hỏi
                  </SoftButton>
                  <SoftButton
                    title="Đọc đáp án"
                    onClick={readBack}
                    className="flex items-center gap-2"
                  >
                    <Volume2 className="w-4 h-4" /> Đọc đáp án
                  </SoftButton>
                </div>
              </div>

              {finished && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 160, damping: 18 }}
                  className="w-full max-w-[720px] rounded-3xl bg-white/65 border border-white/70 shadow-sm p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white/80 border border-white/80 shadow-sm flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-lg font-extrabold">
                        Hoàn thành rồi! 🎉
                      </div>
                      <div className="text-sm opacity-80 font-medium">
                        Em đã lật hết {total} thẻ. Bấm <b>Trộn</b> để luyện lại
                        nhé!
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </main>

        <footer className="mt-10 text-center text-xs opacity-70">
          Làm bằng ❤️ cho học sinh tiểu học • Flashcards từ file đính kèm
        </footer>
      </div>
    </div>
  );
}
