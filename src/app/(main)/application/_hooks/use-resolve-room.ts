'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createChatRoom, getMyChatRooms } from '@/app/api/chat';
import { useAuthStore } from '@/stores/auth-store';
import { getUserRoleFromCookie } from '@/app/api/cookie-utils';
import type { ApplicationItem } from './use-applications';

/**
 * applicationId → roomId 해결
 *
 * 입양자: 채팅방이 없으면 POST /api/chat/rooms로 자동 생성 (있으면 기존 방 반환)
 * 브리더: GET /api/chat/rooms에서 applicationId 매칭으로 방 찾기 (생성 불가)
 */
export function useResolveRoom(application: ApplicationItem | undefined) {
  const { user } = useAuthStore();
  const cookieRole = getUserRoleFromCookie();
  const userRole = cookieRole || user?.role;
  const isAdopter = userRole === 'adopter';
  const queryClient = useQueryClient();

  // 내 채팅방 목록 조회 (실패해도 빈 배열로 처리)
  const roomsQuery = useQuery({
    queryKey: ['chat-rooms'],
    queryFn: getMyChatRooms,
    enabled: !!application,
    staleTime: 30_000,
    retry: 1,
  });

  // applicationId가 일치하는 기존 채팅방 탐색
  const existingRoom = roomsQuery.data?.find(
    (r) => r.applicationId === application?.applicationId,
  );

  // 입양자 전용: 채팅방 생성 mutation
  const createRoomMutation = useMutation({
    mutationFn: () =>
      createChatRoom({
        breederId: application!.breederId!,
        applicationId: application!.applicationId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-rooms'] });
    },
  });

  // 입양자이고 (목록 조회 완료 또는 실패) 후 방이 없으면 자동 생성
  useEffect(() => {
    const roomsSettled = !roomsQuery.isLoading; // 성공/실패 모두 포함
    if (
      isAdopter &&
      application?.breederId &&
      roomsSettled &&
      !existingRoom &&
      !createRoomMutation.isPending &&
      !createRoomMutation.data
    ) {
      createRoomMutation.mutate();
    }
  }, [isAdopter, application?.breederId, application?.applicationId, roomsQuery.isLoading, existingRoom]); // eslint-disable-line react-hooks/exhaustive-deps

  // 우선순위: 목록에서 찾은 방 > 방금 생성한 방
  const roomId = existingRoom?.id ?? createRoomMutation.data?.id ?? null;

  return {
    roomId,
    isLoading: roomsQuery.isLoading || createRoomMutation.isPending,
    error: createRoomMutation.error ?? null,
  };
}
