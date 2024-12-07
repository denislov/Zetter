import { IndexFlatL2, Index, IndexFlatIP, MetricType } from "faiss-node";
import { getLocaleID, getString } from "../utils/locale";
import { fstat } from "fs";
function example(
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) {
  const original = descriptor.value;
  descriptor.value = function (...args: any) {
    try {
      ztoolkit.log(`Calling example ${target.name}.${String(propertyKey)}`);
      return original.apply(this, args);
    } catch (e) {
      ztoolkit.log(`Error in example ${target.name}.${String(propertyKey)}`, e);
      throw e;
    }
  };
  return descriptor;
}

export class Faiss {
  @example
  static registerRightClickMenuItem() {
    const menuIcon = `chrome://${addon.data.config.addonRef}/content/icons/favicon@0.5x.png`;
    // item menuitem with icon
    ztoolkit.Menu.register("item", {
      tag: "menuitem",
      id: "zotero-itemmenu-addonzetter-testfaiss",
      label: "测试faiss",
      commandListener: (ev) => {},
      icon: menuIcon,
    });
  }

  testFaiss() {
    const dimension = 2;
    const index = fstat(1, () => {});
    // Zotero.File.getCharsetFromFile()
    // IOUtils.r

    // ztoolkit.log(index.getDimension()); // 2
    // ztoolkit.log(index.isTrained()); // true
    // ztoolkit.log(index.ntotal()); // 0

    //     // inserting data into index.
    //     index.add([1, 0]);
    //     index.add([1, 2]);
    //     index.add([1, 3]);
    //     index.add([1, 1]);

    //     ztoolkit.log(index.ntotal()); // 4

    //     const k = 4;
    //     const results = index.search([1, 0], k);
    //     ztoolkit.log(results.labels); // [ 0, 3, 1, 2 ]
    //     ztoolkit.log(results.distances); // [ 0, 1, 4, 9 ]

    //     // Save index
    //     const fname = "faiss.index";
    //     index.write(fname);

    //     // Load saved index
    //     const index_loaded = IndexFlatL2.read(fname);
    //     ztoolkit.log(index_loaded.getDimension()); //2
    //     ztoolkit.log(index_loaded.ntotal()); //4
    //     const results1 = index_loaded.search([1, 1], 4);
    //     ztoolkit.log(results1.labels); // [ 3, 0, 1, 2 ]
    //     ztoolkit.log(results1.distances); // [ 0, 1, 1, 4 ]

    //     // Merge index
    //     const newIndex = new IndexFlatL2(dimension);
    //     newIndex.mergeFrom(index);
    //     ztoolkit.log(newIndex.ntotal()); // 4

    //     // Remove items
    //     ztoolkit.log(newIndex.search([1, 2], 1)); // { distances: [ 0 ], labels: [ 1 ] }
    //     const removedCount = newIndex.removeIds([0]);
    //     ztoolkit.log(removedCount); // 1
    //     ztoolkit.log(newIndex.ntotal()); // 3
    //     ztoolkit.log(newIndex.search([1, 2], 1)); // { distances: [ 0 ], labels: [ 0 ] }

    //     // IndexFlatIP
    //     const ipIndex = new IndexFlatIP(2);
    //     ipIndex.add([1, 0]);

    //     // Serialize an index
    //     const index_buf = newIndex.toBuffer();
    //     const deserializedIndex = Index.fromBuffer(index_buf);
    //     ztoolkit.log(deserializedIndex.ntotal()); // 3

    //     // Factory index
    //     const hnswIndex = Index.fromFactory(
    //       2,
    //       "HNSW,Flat",
    //       MetricType.METRIC_INNER_PRODUCT,
    //     );
    //     const x = [1, 0, 0, 1];
    //     hnswIndex.train(x);
    //     hnswIndex.add(x);
  }
}
