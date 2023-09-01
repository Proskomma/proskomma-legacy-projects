const {gql} = require("apollo-server-express");

const scalarSchema = gql`
    scalar OrgName
    scalar TranslationId
    scalar BookCode
    scalar ContentType
    `;

const querySchema = gql`
    type Query {
        """A list of organizations from which this server can serve data"""
        orgs: [Org!]!
        """The organization with the given name, if found"""
        org(
            """The name of the organization"""
            name: OrgName!
        ): Org
    }
    """An organization from which this server can serve data"""
    type Org {
        """A short name for the organization"""
        name: OrgName!
        """A full name for the organization"""
        fullName: String!
        """The content type received from this organization"""
        contentType: ContentType!
        """The number of catalog entries for this organization"""
        nCatalogEntries: Int!
        """The number of local translations for this organization"""
        nLocalTranslations(
            """Only count translations with local USFM"""
            withUsfm: Boolean
            """Only count translations with local USX"""
            withUsx: Boolean
        )
        : Int!
        """The catalog entries that are available from this organization"""
        catalogEntries(
            """The ids of the catalogEntries"""
            withId: [TranslationId!]
            """Filter according to presence or absence of USFM"""
            withUsfm: Boolean
            """Filter according to presence or absence of USX"""
            withUsx: Boolean
            """Filter by language codes"""
            withLanguageCode: [String!]
            """Filter by text matches in title"""
            withMatchingMetadata: [String!]
            """Sort by id, languageCode or title"""
            sortedBy: String
            """Sort in reverse order"""
            reverse: Boolean
        ): [CatalogEntry!]!
        """Catalog entry of this organization with the given id, if found"""
        catalogEntry(
            """The id of the catalog entry"""
            id: TranslationId!
        ): CatalogEntry
        """The translations that are available locally from this organization"""
        localTranslations(
            """The ids of the translations"""
            withId: [TranslationId!]
            """Filter according to presence or absence of USFM"""
            withUsfm: Boolean
            """Filter according to presence or absence of USX"""
            withUsx: Boolean
            """Filter according to presence or absence of succinct JSON"""
            withSuccinct: Boolean
            """Filter according to presence or absence of succinct generation error"""
            withSuccinctError: Boolean
            """Filter by language codes"""
            withLanguageCode: [String!]
            """Filter by text matches in title"""
            withMatchingMetadata: [String!]
            """Sort by id, languageCode or title"""
            sortedBy: String
            """Sort in reverse order"""
            reverse: Boolean
        ): [Translation!]!
        """Translation of this organization with the given id, if found locally"""
        localTranslation(
            """The id of the translation"""
            id: TranslationId!
        ): Translation
    }
    """A Catalog Entry"""
    type CatalogEntry {
        """An id for the translation which is unique within the organization"""
        id: TranslationId!
        """The language code"""
        languageCode: String!
        """a title of the translation"""
        title: String!
        """Is USFM available locally?"""
        hasLocalUsfm: Boolean!
        """Is USX available locally?"""
        hasLocalUsx: Boolean!
        """Is Proskomma succinct docSet available locally?"""
        hasLocalSuccinct: Boolean!
    }
    type Translation {
        """An id for the translation which is unique within the organization"""
        id: TranslationId!
        """The language code"""
        languageCode: String!
        """a title of the translation"""
        title: String!
        """The direction of the text"""
        textDirection: String
        """The script for the language"""
        script: String
        """A copyright message"""
        copyright: String!
        """An abbreviation"""
        abbreviation: String!
        """The number of Scripture books as USFM in this translation"""
        nUsfmBooks: Int
        """The bookCodes of Scripture books as USFM in this translation"""
        usfmBookCodes: [BookCode!]
        """Whether or not USFM for this bookCode is present for this translation"""
        hasUsfmBookCode(
            """The bookCode (3-char upper-case Paratext format)"""
            code: BookCode!
        ): Boolean
        """Is USFM available?"""
        hasUsfm: Boolean!
        """The USFM for this translation"""
        usfmForBookCode(
            """The bookCode"""
            code: BookCode!
        ): String
        nUsxBooks: Int
        """The bookCodes of Scripture books as USX in this translation"""
        usxBookCodes: [BookCode!]
        """Whether or not USX for this bookCode is present for this translation"""
        hasUsxBookCode(
            """The bookCode (3-char upper-case Paratext format)"""
            code: BookCode!
        ): Boolean
        """Is USX available?"""
        hasUsx: Boolean!
        """The USX for this translation"""
        usxForBookCode(
            """The bookCode"""
            code: BookCode!
        ): String
        """Is Proskomma succinct docSet available?"""
        hasSuccinct: Boolean!
        """The Proskomma succinct docSet for this translation"""
        succinct: String
        """Is there a succinct Json error?"""
        hasSuccinctError: Boolean!
        """The succinct Json error for this translation"""
        succinctError: String
        """Is VRS file available?"""
        hasVrs: Boolean!
        """The VRS file for this translation"""
        vrs: String
    }
    `;
const mutationSchema = gql`
    type Mutation {
        """Fetches and processes the specified USFM content from a remote server"""
        fetchUsfm(
            """The name of the organization"""
            org: OrgName!
            """The organization-specific identifier of the translation"""
            translationId: TranslationId!
        ) : Boolean!
        deleteLocalTranslation (
            """The name of the organization"""
            org: OrgName!
            """The organization-specific identifier of the translation"""
            translationId: TranslationId!
        ) : Boolean!
        """Fetches and processes the specified USX content from a remote server"""
        fetchUsx(
            """The name of the organization"""
            org: OrgName!
            """The organization-specific identifier of the translation"""
            translationId: TranslationId!
        ) : Boolean!
        """Makes succinct JSON from USFM or USX for the specified translation"""
        makeSuccinct(
            """The name of the organization"""
            org: OrgName!
            """The organization-specific identifier of the translation"""
            translationId: TranslationId!
        ) : Boolean!
        """Deletes a succinct error, if present, which will allow succinct generation by the cron"""
        deleteSuccinctError(
            """The name of the organization"""
            org: OrgName!
            """The organization-specific identifier of the translation"""
            translationId: TranslationId!
        ) : Boolean!
    }
`;

module.exports = {scalarSchema, querySchema, mutationSchema };
