import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";

// components

import {
  Drawer,
  Button,
  Row,
  Form,
  Col,
  Space,
  Divider,
  Input,
  Select,
  DatePicker,
  Switch,
  InputRef,
} from "antd";

// hooks
import { useEditorContext } from "~/context/editor-context";
import { useFormContext, useController } from "react-hook-form";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// api
import { api } from "~/utils/api";

// types
import type { CreateData } from "~/libs/validation/posts";
import type { SubmitHandler } from "react-hook-form";
import type { FormInstance } from "antd";
import { useMedia } from "~/libs/hooks/useMedia";

interface InternalPostsPublishDrawerProps {
  setForm: (form: FormInstance | null) => void;
  setLoading: (loading: boolean) => void;
}

const InternalPostsPublishDrawer: React.FC<InternalPostsPublishDrawerProps> = ({
  setForm,
  setLoading,
}) => {
  const [keyword_categories, setKeywordCategories] = useState<string>("");

  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const { t } = useTranslation();
  const $form = useRef<FormInstance>(null);
  const { handleSubmit, control, watch } = useFormContext<CreateData>();

  console.log(watch());

  const [items, setItems] = useState(["jack", "lucy"]);
  const [name, setName] = useState("");
  const inputRef = useRef<InputRef | null>(null);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    setItems([...items, name || `New item`]);
    setName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const query_categories = api.categories.pages.useQuery(
    {
      page: 1,
      pageSize: 100,
    },
    {
      staleTime: Infinity,
    }
  );

  const categories = useMemo(() => {
    return query_categories.data?.data?.list ?? [];
  }, [query_categories.data?.data?.list]);

  const mutation_create = api.posts.create.useMutation();

  const mutation_update = api.posts.update.useMutation();

  const control_published = useController({
    control,
    name: "published",
  });

  const control_description = useController({
    control,
    name: "dsecription",
  });

  const control_categoryId = useController({
    control,
    name: "categoryId",
  });

  const control_issueDate = useController({
    control,
    name: "issueDate",
  });

  const onSubmit: SubmitHandler<CreateData> = (input) => {
    const id = router.query.id?.toString();
    if (!id) {
      mutation_create.mutate(input);
      return;
    }
  };

  useEffect(() => {
    setForm($form.current);
  }, []);

  useEffect(() => {
    if (mutation_create.isLoading || mutation_update.isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [mutation_create.isLoading, mutation_update.isLoading]);

  return (
    <Form layout="vertical" ref={$form} onFinish={handleSubmit(onSubmit)}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="description"
            label={t("dashboard.posts.write.description_label")}
            extra={t("dashboard.posts.write.description_desc")}
          >
            <Input.TextArea
              placeholder={t("dashboard.posts.write.description_placeholder")}
              autoSize={{ minRows: 3, maxRows: 5 }}
              {...control_description.field}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label={t("dashboard.posts.write.category_label")}>
            <Select
              placeholder={t("dashboard.posts.write.category_placeholder")}
              {...control_categoryId.field}
            >
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label={t("dashboard.posts.write.tags_label")}>
            <Select
              placeholder={t("dashboard.posts.write.tags_placeholder")}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: "8px 0" }} />
                  <Space style={{ padding: "0 8px 4px" }}>
                    <Input
                      placeholder={t("dashboard.posts.write.tags_placeholder")}
                      ref={inputRef}
                      value={name}
                      onChange={onNameChange}
                    />
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      onClick={addItem}
                    >
                      {t("dashboard.posts.write.tags_add")}
                    </Button>
                  </Space>
                </>
              )}
              options={items.map((item) => ({ label: item, value: item }))}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="published"
            label={t("dashboard.posts.write.published_label")}
            extra={t("dashboard.posts.write.published_desc")}
          >
            <Switch
              {...control_published.field}
              checked={control_published.field.value}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label={t("dashboard.posts.write.issueDate_label")}
            extra={t("dashboard.posts.write.issueDate_desc")}
          >
            <DatePicker
              showTime
              format={"YYYY-MM-DD HH:mm:ss"}
              name={control_issueDate.field.name}
              value={
                control_issueDate.field.value instanceof Date
                  ? dayjs(control_issueDate.field.value)
                  : undefined
              }
              onChange={(date) => {
                control_issueDate.field.onChange(date?.toDate());
              }}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

const PostsPublishDrawer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [$form, setFormElement] = useState<FormInstance | null>(null);
  const { publish, popoverClose } = useEditorContext();
  const isMobile = useMedia("(max-width: 460px)");
  const { t } = useTranslation();

  const onClose = useCallback(() => {
    popoverClose({ id: "publish" });
  }, [popoverClose]);

  const setForm = useCallback((form: FormInstance | null) => {
    setFormElement(form);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const onSubmit = useCallback(() => {
    $form?.submit();
  }, [$form]);

  useEffect(() => {
    if (!publish.open) {
      setForm(null);
      setIsLoading(false);
    }
  }, [publish.open]);

  return (
    <Drawer
      width={isMobile ? "100%" : 368}
      onClose={onClose}
      destroyOnClose
      open={publish.open}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Button
          loading={isLoading}
          onClick={onSubmit}
          type="primary"
          className="!shadow-none"
        >
          {t("dashboard.posts.write.publish")}
        </Button>
      }
    >
      <InternalPostsPublishDrawer setForm={setForm} setLoading={setLoading} />
    </Drawer>
  );
};

export default PostsPublishDrawer;
