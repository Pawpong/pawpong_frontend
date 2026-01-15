'use client';

import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Volume2, VolumeX } from 'lucide-react';
import Hls from 'hls.js';
import { FeedVideo, getHlsStreamUrl } from '@/app/api/feed';
import { useToggleVideoLike } from '../_hooks/use-feed';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/api/utils';

interface FeedVideoCardProps {
  video: FeedVideo;
  onCommentClick: (videoId: string) => void;
  isInView?: boolean;
}

/**
 * Pawpong 피드 비디오 카드
 */
export function FeedVideoCard({ video, onCommentClick, isInView = true }: FeedVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const toggleLike = useToggleVideoLike();

  // HLS 비디오 초기화
  useEffect(() => {
    if (!videoRef.current) return;

    const videoElement = videoRef.current;
    const videoUrl = video.hlsUrl || video.videoUrl;

    if (!videoUrl) return;

    // HLS 지원 확인
    if (videoUrl.includes('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false, // VOD에서는 false가 좋음
          debug: false,

          // ===== 버퍼 최적화 (끊김 방지) =====
          maxBufferLength: 60, // 최대 60초 버퍼
          maxMaxBufferLength: 120, // 최대 120초까지 확장
          maxBufferSize: 120 * 1000 * 1000, // 120MB 버퍼
          maxBufferHole: 0.5, // 0.5초 이하 갭 무시
          backBufferLength: 60, // 뒤로 60초 버퍼 유지

          // ===== ABR (Adaptive Bitrate) 최적화 =====
          startLevel: -1, // 자동 품질 선택
          abrEwmaDefaultEstimate: 3000000, // 초기 대역폭 3Mbps
          abrBandWidthFactor: 0.9, // 대역폭의 90% 사용
          abrBandWidthUpFactor: 0.7, // 업그레이드 시 70%만 고려

          // ABR 적응 속도
          abrEwmaFastVoD: 4.0,
          abrEwmaSlowVoD: 15.0,

          // ===== 로딩 재시도 =====
          fragLoadingMaxRetry: 4,
          fragLoadingRetryDelay: 500,
          levelLoadingMaxRetry: 4,
          levelLoadingRetryDelay: 500,

          // ===== 기타 최적화 =====
          startFragPrefetch: true, // 다음 세그먼트 미리 로드
          testBandwidth: true, // 대역폭 테스트 활성화
        });

        const hlsUrl = video.hlsUrl?.startsWith('http') ? video.hlsUrl : getHlsStreamUrl(video._id, 'master.m3u8');

        hls.loadSource(hlsUrl);
        hls.attachMedia(videoElement);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (isInView) {
            videoElement.play().catch(console.error);
            setIsPlaying(true);
          }
        });

        // 에러 핸들링
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.error('HLS Error:', data.type, data.details);
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.warn('Network error, trying to recover...');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.warn('Media error, trying to recover...');
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                break;
            }
          }
        });

        return () => {
          hls.destroy();
        };
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        const hlsUrl = video.hlsUrl?.startsWith('http') ? video.hlsUrl : getHlsStreamUrl(video._id, 'master.m3u8');
        videoElement.src = hlsUrl;

        if (isInView) {
          videoElement.play().catch(console.error);
          setIsPlaying(true);
        }
      }
    } else {
      // 일반 비디오
      videoElement.src = videoUrl;
      if (isInView) {
        videoElement.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  }, [video._id, video.hlsUrl, video.videoUrl, isInView]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleLikeToggle = () => {
    toggleLike.mutate(video._id);
  };

  return (
    <article className="w-full bg-white border-b border-[#e1e1e1] pb-4">
      {/* 헤더: 사용자 정보 */}
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-[#4f3b2e]">
            <AvatarImage src={video.uploaderProfileImage} alt={video.uploaderName} />
            <AvatarFallback className="bg-[#f6f6ea] text-[#4f3b2e] text-sm font-bold">
              {video.uploaderName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#4f3b2e]">{video.uploaderName}</span>
            <span className="text-xs text-[#888]">
              {new Date(video.createdAt).toLocaleDateString('ko-KR', {
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
        <button className="p-2 hover:bg-[#f6f6ea] rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5 text-[#4f3b2e]" />
        </button>
      </header>

      {/* 비디오 */}
      <div className="relative w-full bg-black overflow-hidden" onClick={togglePlayPause}>
        <video
          ref={videoRef}
          className="w-full max-h-[600px] object-contain"
          loop
          muted={isMuted}
          playsInline
          style={{ aspectRatio: '4/5' }}
        />

        {/* 음소거 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
          className="absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center bg-[#4f3b2e]/80 backdrop-blur-sm rounded-full hover:bg-[#4f3b2e] transition-colors"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
        </button>

        {/* 조회수 */}
        <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full">
          <span className="text-xs text-white font-medium">조회 {video.viewCount.toLocaleString()}</span>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-4">
          <button onClick={handleLikeToggle} className="hover:opacity-70 transition-opacity active:scale-95">
            <Heart className={cn('w-6 h-6', video.isLiked ? 'fill-[#e84c3d] stroke-[#e84c3d]' : 'stroke-[#4f3b2e]')} />
          </button>

          <button
            onClick={() => onCommentClick(video._id)}
            className="hover:opacity-70 transition-opacity active:scale-95"
          >
            <MessageCircle className="w-6 h-6 stroke-[#4f3b2e]" />
          </button>

          <button className="hover:opacity-70 transition-opacity active:scale-95">
            <Send className="w-6 h-6 stroke-[#4f3b2e]" />
          </button>
        </div>

        <button className="hover:opacity-70 transition-opacity active:scale-95">
          <Bookmark className="w-6 h-6 stroke-[#4f3b2e]" />
        </button>
      </div>

      {/* 좋아요 수 */}
      <div className="px-4 pt-2">
        <button className="text-sm font-bold text-[#4f3b2e] hover:opacity-70">
          좋아요 {video.likeCount.toLocaleString()}개
        </button>
      </div>

      {/* 제목 및 설명 */}
      <div className="px-4 pt-2">
        <div className="text-sm">
          <span className="font-bold text-[#4f3b2e] mr-2">{video.uploaderName}</span>
          <span className="text-[#3c3c3c]">{video.title}</span>
        </div>
        {video.description && <p className="text-sm text-[#545454] mt-1 line-clamp-2">{video.description}</p>}
      </div>

      {/* 댓글 보기 버튼 */}
      {video.commentCount > 0 && (
        <button
          onClick={() => onCommentClick(video._id)}
          className="px-4 pt-2 text-sm text-[#888] hover:text-[#4f3b2e]"
        >
          댓글 {video.commentCount}개 모두 보기
        </button>
      )}

      {/* 태그 */}
      {video.tags.length > 0 && (
        <div className="px-4 pt-2 flex flex-wrap gap-2">
          {video.tags.slice(0, 4).map((tag, index) => (
            <button
              key={index}
              className="px-3 py-1.5 bg-[#f6f6ea] text-sm text-[#4f3b2e] font-medium rounded-full hover:bg-[#eeebde] transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
