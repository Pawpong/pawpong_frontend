// src/store/filterStore.ts

import { Filter, filter as filterData } from "@/constants/filter"; // filter 데이터와 타입을 import
import { create } from "zustand";

// --- 헬퍼 함수들 (스토어 내부에서 사용) ---
export const findNodeByLabel = (
  label: string,
  nodes: Filter[]
): Filter | null => {
  for (const node of nodes) {
    if (node.label === label) return node;
    if (node.children) {
      const found = findNodeByLabel(label, node.children);
      if (found) return found;
    }
  }
  return null;
};

export const findParentAndChildren = (
  leafLabel: string,
  nodes: Filter[]
): { parent: Filter | null; childrenLabels: string[] } => {
  for (const node of nodes) {
    if (node.children) {
      const parentCandidate = node.children.find((child) =>
        child.children?.some((leaf) => leaf.label === leafLabel)
      );
      if (parentCandidate && parentCandidate.children) {
        return {
          parent: parentCandidate,
          childrenLabels: parentCandidate.children.map((c) => c.label),
        };
      }
    }
  }
  return { parent: null, childrenLabels: [] };
};
// --- 헬퍼 함수 끝 ---

interface FilterState {
  // 최종 적용된 필터 (사이드바 등에서 사용)
  activeFilters: string[];

  // 모달 내부의 임시 상태
  tempSelectedLeaves: string[];
  selectionPath: Filter[];

  // 액션 함수들
  initModalState: () => void; // 모달이 열릴 때 상태 초기화
  resetModalState: () => void; // animal 변경 시 모달 상태 리셋

  selectPath: (item: Filter, columnIndex: number) => void;
  selectTempLeaf: (
    itemLabel: string,
    checked: boolean,
    animal: "cat" | "dog"
  ) => void;
  selectAllTempLeaves: (parentItem: Filter, shouldSelect: boolean) => void;

  applyTempFilters: () => void; // 임시 선택을 최종 필터에 적용
  removeActiveFilter: (itemLabel: string, animal: "cat" | "dog") => void;
  clearAllFilters: () => void;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  // --- 상태 ---
  activeFilters: [],
  tempSelectedLeaves: [],
  selectionPath: [],

  // --- 액션 ---
  initModalState: () => {
    // 모달이 열릴 때, 현재 적용된 필터를 임시 선택 상태로 복사
    set({ tempSelectedLeaves: get().activeFilters });
  },

  resetModalState: () => {
    set({ selectionPath: [], tempSelectedLeaves: [] });
  },

  selectPath: (item, columnIndex) => {
    set((state) => {
      const newPath = state.selectionPath.slice(0, columnIndex);
      newPath.push(item);
      let currentItem = item;
      while (currentItem.children?.[0]?.children) {
        const nextItem = currentItem.children[0];
        newPath.push(nextItem);
        currentItem = nextItem;
      }
      return { selectionPath: newPath };
    });
  },

  selectTempLeaf: (itemLabel, checked, animal) => {
    const rootFilters = filterData[animal];
    const { parent, childrenLabels } = findParentAndChildren(
      itemLabel,
      rootFilters
    );

    set((state) => {
      let newSelection = [...state.tempSelectedLeaves];
      if (!parent || childrenLabels.length === 0) {
        return {
          tempSelectedLeaves: checked
            ? [...newSelection, itemLabel]
            : newSelection.filter((l) => l !== itemLabel),
        };
      }

      if (checked) {
        newSelection.push(itemLabel);
        const allChildrenSelected = childrenLabels.every((child) =>
          newSelection.includes(child)
        );
        if (allChildrenSelected) {
          newSelection = newSelection.filter(
            (label) => !childrenLabels.includes(label)
          );
          newSelection.push(parent.label);
        }
      } else {
        if (newSelection.includes(parent.label)) {
          newSelection = newSelection.filter((label) => label !== parent.label);
          const otherChildren = childrenLabels.filter(
            (label) => label !== itemLabel
          );
          newSelection.push(...otherChildren);
        } else {
          newSelection = newSelection.filter((label) => label !== itemLabel);
        }
      }
      return { tempSelectedLeaves: newSelection };
    });
  },

  selectAllTempLeaves: (parentItem, shouldSelect) => {
    const childrenLabels = parentItem.children?.map((c) => c.label) ?? [];
    if (childrenLabels.length === 0) return;

    set((state) => {
      const newSelection = state.tempSelectedLeaves.filter(
        (label) => !childrenLabels.includes(label) && label !== parentItem.label
      );
      if (shouldSelect) {
        newSelection.push(parentItem.label);
      }
      return { tempSelectedLeaves: newSelection };
    });
  },

  applyTempFilters: () => {
    // 임시 상태를 최종 상태로 적용
    set({ activeFilters: get().tempSelectedLeaves });
  },

  removeActiveFilter: (itemLabel, animal) => {
    // 사이드바에서 필터 제거 (복잡한 로직이 필요할 수 있으므로 분리)
    const rootFilters = filterData[animal];
    const node = findNodeByLabel(itemLabel, rootFilters);

    set((state) => {
      let newActiveFilters = [...state.activeFilters];
      if (node && node.children) {
        // 부모 노드 제거
        newActiveFilters = newActiveFilters.filter(
          (leaf) => leaf !== itemLabel
        );
      } else {
        // 자식 노드 제거 (체크 해제 로직과 유사)
        const { parent, childrenLabels } = findParentAndChildren(
          itemLabel,
          rootFilters
        );
        if (parent && newActiveFilters.includes(parent.label)) {
          newActiveFilters = newActiveFilters.filter((l) => l !== parent.label);
          const otherChildren = childrenLabels.filter((l) => l !== itemLabel);
          newActiveFilters.push(...otherChildren);
        } else {
          newActiveFilters = newActiveFilters.filter((l) => l !== itemLabel);
        }
      }
      // activeFilters와 tempSelectedLeaves를 동기화
      return {
        activeFilters: newActiveFilters,
        tempSelectedLeaves: newActiveFilters,
      };
    });
  },

  clearAllFilters: () => {
    // 모든 필터 상태 초기화
    set({ activeFilters: [], tempSelectedLeaves: [], selectionPath: [] });
  },
}));
