import { describeCollection } from '../describeCollection';
import { PineconeArgumentError } from '../../errors';
import { IndexOperationsApi } from '../../pinecone-generated-ts-fetch';
import type {
  DescribeCollectionRequest as DCR,
  CollectionMeta,
} from '../../pinecone-generated-ts-fetch';

const setupMocks = (
  describeResponse,
  listCollectionResponse: () => Promise<Array<string>>
) => {
  const fakeDescribeCollection: (req: DCR) => Promise<CollectionMeta> = jest
    .fn()
    .mockImplementation(describeResponse);
  const fakeListCollections: () => Promise<Array<string>> = jest
    .fn()
    .mockImplementation(listCollectionResponse);
  const IOA = {
    describeCollection: fakeDescribeCollection,
    listCollections: fakeListCollections,
  };
  return IOA as IndexOperationsApi;
};

describe('describeCollection', () => {
  describe('argument validation', () => {
    test('should throw if collection name is not provided', async () => {
      const IOA = setupMocks(
        () => Promise.resolve(''),
        () => Promise.resolve([])
      );
      // @ts-ignore
      const expectToThrow = async () => await describeCollection(IOA)();

      expect(expectToThrow).rejects.toThrowError(PineconeArgumentError);
      expect(expectToThrow).rejects.toThrowError(
        'The argument to describeCollection had type errors: argument must be string.'
      );
    });

    test('should throw if collection name is not a string', async () => {
      const IOA = setupMocks(
        () => Promise.resolve(''),
        () => Promise.resolve([])
      );
      // @ts-ignore
      const expectToThrow = async () => await describeCollection(IOA)({});

      expect(expectToThrow).rejects.toThrowError(PineconeArgumentError);
      expect(expectToThrow).rejects.toThrowError(
        'The argument to describeCollection had type errors: argument must be string.'
      );
    });

    test('should throw if collection name is empty string', async () => {
      const IOA = setupMocks(
        () => Promise.resolve(''),
        () => Promise.resolve([])
      );
      // @ts-ignore
      const expectToThrow = async () => await describeCollection(IOA)('');

      expect(expectToThrow).rejects.toThrowError(PineconeArgumentError);
      expect(expectToThrow).rejects.toThrowError(
        'The argument to describeCollection had validation errors: argument must not be blank.'
      );
    });
  });

  describe('happy path', () => {
    test('it should return the collection meta', async () => {
      const IOA = setupMocks(
        () =>
          Promise.resolve({
            name: 'collection-name',
            size: 3085509,
            status: 'Ready',
            vectorCount: 120,
          }),
        () => Promise.resolve([])
      );

      // @ts-ignore
      const response = await describeCollection(IOA)('collection-name');

      expect(response).toEqual({
        name: 'collection-name',
        size: 3085509,
        status: 'Ready',
        recordCount: 120,
      });
    });
  });
});
