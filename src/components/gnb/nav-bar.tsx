'use client';

import Link from 'next/link';
import { MouseEvent, useState } from 'react';
import { useSegment } from '@/hooks/use-segment';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useNavigationGuardContext } from '@/contexts/navigation-guard-context';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { NAV_ITEMS, NAV_ITEMS_BREEDER, NavItem } from './nav-items';
import { logout } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore, type AuthUser } from '@/stores/auth-store';

interface NavBarProps {
  navVariant?: 'default' | 'breeder';
}

interface DropdownMenuWithStateProps {
  item: NavItem;
  active: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  hasHydrated: boolean;
  handleLinkClick: (e: MouseEvent<HTMLAnchorElement>, href: string) => void;
  handleLogout: (e: MouseEvent<HTMLAnchorElement>) => Promise<void>;
}

function DropdownMenuWithState({
  item,
  active,
  isAuthenticated,
  user,
  hasHydrated,
  handleLinkClick,
  handleLogout,
}: DropdownMenuWithStateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // 비회원이 인증 필요 메뉴 클릭 시 로그인 페이지로 이동
  const handleOpenChange = (open: boolean) => {
    if (open && item.requiresAuth && !isAuthenticated) {
      router.push('/login');
      return;
    }
    setIsOpen(open);
  };

  // 드롭다운이 열려있거나 실제로 active 상태면 활성화
  const isActiveState = active || isOpen;
  const ActiveIcon = isActiveState ? item.iconFill : item.icon;

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'h-auto gap-1.5 has-[>svg]:px-5 text-body-s text-grayscale-gray6 focus-visible:ring-0 focus-visible:ring-offset-0',
            isActiveState && 'text-primary',
          )}
        >
          <ActiveIcon className="size-5" />
          <span
            className={cn({
              'text-primary font-semibold': isActiveState,
            })}
          >
            {item.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={12}
        className="border border-grayscale-gray2/50 rounded-lg p-1 shadow-[0px_8px_24px_rgba(12,17,29,0.12)] "
      >
        {item.children
          ?.filter((child) => {
            // hydration이 완료되지 않았으면 showForVerificationStatus가 있는 항목은 숨김
            if (!hasHydrated && child.showForVerificationStatus) {
              return false;
            }
            // 로그아웃 항목은 인증된 경우에만 표시
            if (child.action === 'logout' && !isAuthenticated) {
              return false;
            }
            // showForVerificationStatus가 설정된 경우, 브리더이고 해당 status에 맞는 경우에만 표시
            if (child.showForVerificationStatus) {
              if (user?.role !== 'breeder') {
                return false;
              }
              return child.showForVerificationStatus.includes(user.verificationStatus || 'pending');
            }
            return true;
          })
          .map((child) => {
            const ChildIcon = child.icon;
            const isMuted = child.variant === 'muted';
            const isDisabled = child.variant === 'disabled';
            const isLogout = child.action === 'logout';

            const isExternalLink = child.href.startsWith('http://') || child.href.startsWith('https://');

            return (
              <DropdownMenuItem
                key={child.name}
                asChild
                className={cn(
                  'px-4 py-2 text-body-s text-grayscale-gray7 gap-3 cursor-pointer w-[9.5625rem]',
                  isMuted && 'text-grayscale-gray5 font-medium',
                  isDisabled && 'text-[#e1e1e1] font-medium cursor-default pointer-events-none',
                )}
              >
                <Link
                  href={child.href}
                  target={isExternalLink ? '_blank' : undefined}
                  rel={isExternalLink ? 'noopener noreferrer' : undefined}
                  onClick={(e) => {
                    if (isLogout) {
                      handleLogout(e);
                      return;
                    }
                    if (!isExternalLink) {
                      handleLinkClick(e, child.href);
                    }
                  }}
                  aria-disabled={isDisabled}
                >
                  <div className={cn('flex items-center gap-3', !ChildIcon && 'gap-0')}>
                    {ChildIcon && <ChildIcon className="size-5 text-grayscale-gray5" />}
                    <span>{child.name}</span>
                  </div>
                </Link>
              </DropdownMenuItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function NavBar({ navVariant = 'default' }: NavBarProps) {
  const currNav = useSegment(0);
  const pathname = usePathname();
  const router = useRouter();
  const guardContext = useNavigationGuardContext();
  const { toast } = useToast();
  const { isAuthenticated, clearAuth, user, hasHydrated } = useAuthStore();
  const navConfig = navVariant === 'breeder' ? NAV_ITEMS_BREEDER : NAV_ITEMS;

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, href: string, requiresAuth?: boolean) => {
    // 비회원이 인증 필요 메뉴 클릭 시 로그인 페이지로 이동
    if (requiresAuth && !isAuthenticated) {
      e.preventDefault();
      router.push('/login');
      return;
    }

    // Context가 없거나 같은 페이지면 기본 동작 허용
    if (!guardContext?.guardNavigation || pathname === href) {
      return;
    }

    // 가드 로직 실행
    e.preventDefault();
    guardContext.guardNavigation(href);
  };

  const handleLogout = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // 이미 로그아웃 상태면 실행하지 않음
    if (!isAuthenticated) {
      return;
    }

    try {
      await logout();
      clearAuth();
      toast({
        title: '로그아웃 완료',
        description: '성공적으로 로그아웃되었습니다.',
      });
      // 하드 리다이렉트로 모든 상태 초기화
      window.location.href = '/';
    } catch (error) {
      toast({
        title: '로그아웃 실패',
        description: error instanceof Error ? error.message : '다시 시도해주세요.',
      });
    }
  };

  return (
    <div className="flex">
      {navConfig.map((item) => {
        const isApplicationMenu = item.href === '/application';
        const hasChildren = Boolean(item.children?.length);

        // children이 있는 경우, children 중 하나가 활성화되어 있으면 부모도 활성화
        const isChildActive = hasChildren
          ? item.children?.some((child) => currNav === child.href.slice(1)) ?? false
          : false;

        // 홈화면일 때는 아무것도 활성화하지 않음
        const isHomePage = pathname === '/';
        // 탐색 메뉴는 /explore 또는 /counselform일 때 활성화
        const isExploreMenu = item.href === '/explore';
        const isCounselFormPage = pathname === '/counselform';
        const active = isHomePage
          ? false
          : isApplicationMenu
          ? currNav === 'application' || currNav === 'receivedApplications'
          : isExploreMenu
          ? currNav === item.href.slice(1) || isChildActive || isCounselFormPage
          : hasChildren
          ? currNav === item.href.slice(1) || isChildActive
          : currNav === item.href.slice(1);

        const Icon = active ? item.iconFill : item.icon;

        if (!hasChildren) {
          return (
            <Link href={item.href} key={item.name} onClick={(e) => handleLinkClick(e, item.href, item.requiresAuth)}>
              <Button
                key={item.name}
                variant="ghost"
                className={cn('h-auto gap-1.5 has-[>svg]:px-5 text-body-s text-grayscale-gray6 hover:text-primary!')}
              >
                <Icon className="size-5" />
                <span
                  className={cn({
                    'text-primary font-semibold': active,
                  })}
                >
                  {item.name}
                </span>
              </Button>
            </Link>
          );
        }

        return (
          <DropdownMenuWithState
            key={item.name}
            item={item}
            active={active}
            isAuthenticated={isAuthenticated}
            user={user}
            hasHydrated={hasHydrated}
            handleLinkClick={handleLinkClick}
            handleLogout={handleLogout}
          />
        );
      })}
    </div>
  );
}
