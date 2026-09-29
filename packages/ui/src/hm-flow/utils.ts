export const generateUniqueNameWithCounter = (
  baseName: string,
  selectedKey: string,
  nodes: any[],
  nodeCounters: Record<string, number>
): { name: string; updatedCounters: Record<string, number> } => {
  const currentCounter = nodeCounters[selectedKey] || 0;
  let uniqueName = `${baseName}-${currentCounter}`;
  let counter = currentCounter;

  while (nodes.some((node) => node.data.label === uniqueName)) {
    counter++;
    uniqueName = `${baseName}-${counter}`;
  }

  const updatedCounters = {
    ...nodeCounters,
    [selectedKey]: counter + 1
  };

  return { name: uniqueName, updatedCounters };
};

export const generateUniqueLabel = (label: string, existingNodes: any[]) => {
  let uniqueLabel = label;
  let counter = 1;
  while (existingNodes.some((node) => node.data.label === uniqueLabel)) {
    uniqueLabel = `${label}-Copy-${counter}`;
    counter++;
  }

  return uniqueLabel;
};
